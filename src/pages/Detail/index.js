import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import dataBeratBadanByUmurPria from "../../json/ZScoreBeratBadanLakiLaki.json";
import dataBeratBadanByUmurPerempuan from "../../json/ZScoreBeratBadanPerempuan.json";
import dataTinggiBadanByUmurPria from "../../json/ZScorePanjangBadanLakiLaki.json";
import dataTinggiBadanByUmurPerempuan from "../../json/ZScorePanjangBadanPerempuan.json";
import dataLingkarKepalaByUmurPria from "../../json/ZScoreLingkarKepalaLakiLaki.json";
import dataLingkarKepalaByUmurPerempuan from "../../json/ZScoreLingkarKepalaPerempuan.json";
import dataBeratTinggiBadanPria24Bulan from "../../json/ZScoreBeratTinggiBadanLakiLaki24.json";
import dataBeratTinggiBadanPria60Bulan from "../../json/ZScoreBeratTinggiBadanLakiLaki60.json";
import dataBeratTinggiBadanPerempuan24Bulan from "../../json/ZScoreBeratTinggiBadanPerempuan24.json";
import dataBeratTinggiBadanPerempuan60Bulan from "../../json/ZScoreBeratTinggiBadanPerempuan60.json";

import Navbar from "../../components/layout/Navbar";
import { Col, Row, Space, Table } from "antd";
import FormInputPerkembanganAnak from "../../components/form/FormInputPerkembanganAnak";
import { useParams } from "react-router-dom";
import axios from "axios";
import { monthDiff } from "../../utilities/calculateMonth";
import FormUpdatePerkembanganAnak from "../../components/form/FormUpdatePerkembanganAnak";
import Navigation from "../../components/layout/Navigation";
import Image from "react-bootstrap/Image";
import bayi from "../../assets/img/bayi_1.png";
import "./detail-style.css";
import { AlignCenterOutlined } from "@ant-design/icons";
import bg_dashboard from "../../assets/img/bg-dashboard.svg";
import footerImage from "../../assets/img/powered_by_telkom.svg";
// import { placementColumn } from "../../utilities/columnMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ...registerables
);

const BackgroundComponent = () => (
  <div
    className="absolute top-[80px] left-[-5px] w-[calc(100%+10px)] h-[40vh] min-h-[150px] sm:min-h-[200px] z-[-10000] bg-no-repeat bg-center bg-cover sm:bg-cover rounded-b-[50px] shadow-[0_10px_20px_rgba(0,0,0,0.19)]"
    style={{ backgroundImage: `url(${bg_dashboard})` }}
  />
);

export default function Detail() {
  let { id } = useParams();
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const [
    isOpenModalInputPerkembanganAnak,
    setIsOpenModalInputPerkembanganAnak,
  ] = useState(false);
  const [data, setData] = useState([]);
  const [dataAnak, setDataAnak] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [
    isOpenModalUpdatePerkembanganAnak,
    setIsOpenModalUpdatePerkembanganAnak,
  ] = useState(false);
  const [dataPerkembanganAnak, setDataPerkembanganAnak] = useState(null);

  // const columnYAxis = Array(61).fill(null);
  // const columnYAxisBerat = placementColumn(
  //   columnYAxis,
  //   data,
  //   dataAnak,
  //   "berat"
  // );
  // const columnYAxisTinggi = placementColumn(
  //   columnYAxis,
  //   data,
  //   dataAnak,
  //   "tinggi"
  // );
  // const columnYAxisLingkarKepala = placementColumn(
  //   columnYAxis,
  //   data,
  //   dataAnak,
  //   "lingkar_kepala"
  // );

  // const labels = Array.from(Array(61).keys());

  const labels = Array.from(Array(61).keys());
  // const label_PB = [];
  // for (let i = 45; i <= 110; i += 0.5) {
  //   console.log(i);
  // }
  // const label_PB = [];
  // dataBeratTinggiBadanPria24Bulan.forEach((item) => {
  //   label_PB.push(item.pb);
  // });

  const label_PB_24 = [];
  let value = 45.0;

  while (value <= 110.0) {
    label_PB_24.push(value); // Push the value rounded to 1 decimal place
    value += 0.5;
  }

  const label_PB_60 = [];
  value = 65.0;

  while (value <= 110.0) {
    label_PB_60.push(value); // Push the value rounded to 1 decimal place
    value += 0.5;
  }

  function datasetChart(type) {
    const dataset = [];
    for (let i = 0; i < data.length; i++) {
      if (
        monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date)) * -1 ===
        monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date))
      ) {
        dataset.push(
          monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date)) * -1
        );
      } else {
        dataset.push(
          monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date))
        );
      }
    }

    if (type === "berat") {
      // buatlah 60 array dari bulan "dataset"
      const result = [];
      let j = 0;
      for (let i = 0; i < 61; i++) {
        // kemudian dari "dataset" difilter yang ada value nya di ganti dengan value berat badan
        if (dataset.includes(i) && j < data.length) {
          result.push(Number(data[j].berat));
          j++;
        } else {
          result.push(null);
        }
      }
      return result;
    } else if (type === "tinggi") {
      // buatlah 60 array dari bulan "dataset"
      const result = [];
      let j = 0;
      for (let i = 0; i < 61; i++) {
        // kemudian dari "dataset" difilter yang ada value nya di ganti dengan value tinggi badan
        if (dataset.includes(i) && j < data.length) {
          result.push(Number(data[j].tinggi));
          j++;
        } else {
          result.push(null);
        }
      }
      return result;
    } else if (type === "lingkar_kepala") {
      // buatlah 60 array dari bulan "dataset"
      const result = [];
      let j = 0;
      for (let i = 0; i < 61; i++) {
        // kemudian dari "dataset" difilter yang ada value nya di ganti dengan value lingkar_kepala badan
        if (dataset.includes(i) && j < data.length) {
          result.push(Number(data[j].lingkar_kepala));
          j++;
        } else {
          result.push(null);
        }
      }

      return result;
    } else if (type === "gizi") {
      const dataset_gizi = [];

      for (let i = 0; i < data.length; i++) {
        let floor;
        if (data[i].tinggi - Math.floor(data[i].tinggi) === 0.5) {
          floor = data[i].tinggi;
        } else if (
          data[i].tinggi - Math.floor(data[i].tinggi) === 0 ||
          data[i].tinggi - Math.floor(data[i].tinggi) < 0.5
        ) {
          floor = Math.floor(data[i].tinggi);
        } else {
          floor = Math.floor(data[i].tinggi) + 0.5;
        }
        dataset_gizi.push(floor);
      }
      // buatlah 60 array dari bulan "dataset"
      console.log("test", dataset_gizi);
      const result = [];

      let j = 0;
      if (dataset[0] >= 0 && dataset[0] <= 24) {
        if (dataAnak.gender === "LAKI_LAKI") {
          dataBeratTinggiBadanPria24Bulan.forEach((item) => {
            if (parseFloat(dataset_gizi[j]) === parseFloat(item.pb)) {
              result.push(Number(data[j].berat));
              j++;
            } else {
              result.push(null);
            }
          });
        } else {
          dataBeratTinggiBadanPerempuan24Bulan.forEach((item) => {
            if (parseFloat(dataset_gizi[j]) === parseFloat(item.pb)) {
              result.push(Number(data[j].berat));
              j++;
            } else {
              result.push(null);
            }
          });
        }
      } else if (dataset[0] > 24 && dataset[0] <= 60) {
        if (dataAnak.gender === "LAKI_LAKI") {
          dataBeratTinggiBadanPria60Bulan.forEach((item) => {
            if (parseFloat(dataset_gizi[j]) === parseFloat(item.pb)) {
              result.push(Number(data[j].berat));
              j++;
            } else {
              result.push(null);
            }
          });
        } else {
          dataBeratTinggiBadanPerempuan60Bulan.forEach((item) => {
            if (parseFloat(dataset_gizi[j]) === parseFloat(item.pb)) {
              result.push(Number(data[j].berat));
              j++;
            } else {
              result.push(null);
            }
          });
        }
      }

      console.log("gizi", result);
      return result;
    }
  }

  const dataChartPriaGizi_0_24 = {
    labels: label_PB_24,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("gizi"),
        pointBackgroundColor: "black",
        borderColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratTinggiBadanPria24Bulan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria24Bulan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria24Bulan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria24Bulan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria24Bulan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria24Bulan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria24Bulan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
    ],
  };

  const dataChartPriaGizi_25_60 = {
    labels: label_PB_60,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("gizi"),
        pointBackgroundColor: "black",
        borderColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratTinggiBadanPria60Bulan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria60Bulan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria60Bulan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria60Bulan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria60Bulan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria60Bulan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPria60Bulan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
    ],
  };

  const dataChartPerempuanGizi_0_24 = {
    labels: label_PB_24,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("gizi"),
        pointBackgroundColor: "black",
        borderColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratTinggiBadanPerempuan24Bulan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan24Bulan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan24Bulan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan24Bulan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan24Bulan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan24Bulan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan24Bulan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
    ],
  };

  const dataChartPerempuanGizi_25_60 = {
    labels: label_PB_60,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("gizi"),
        pointBackgroundColor: "black",
        borderColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratTinggiBadanPerempuan60Bulan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan60Bulan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan60Bulan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan60Bulan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan60Bulan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan60Bulan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratTinggiBadanPerempuan60Bulan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
    ],
  };

  const dataChartPriaBB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("berat"),
        pointBackgroundColor: "black",
        borderColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
    ],
  };

  const dataChartPerempuanBB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("berat"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPriaTB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.tinggi),
        data: datasetChart("tinggi"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPerempuanTB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.tinggi),
        data: datasetChart("tinggi"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPriaLK = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.lingkar_kepala),
        data: datasetChart("lingkar_kepala"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPerempuanLK = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.lingkar_kepala),
        data: datasetChart("lingkar_kepala"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const optionsBB = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Berat Badan (kg)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Umur (Bulan)",
        }, // Maximum value for the x-axis
      },
    },
    elements: {
      point: {
        radius: 0,
        pointStyle: "circle",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Berat Badan berdasarkan Umur",
      },
    },
  };

  const optionsTB = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Tinggi Badan (cm)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Umur (Bulan)",
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        pointStyle: "circle",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Tinggi Badan berdasarkan Umur",
      },
    },
  };

  const optionsLK = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Lingkar Kepala (cm)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Umur (Bulan)",
        },
        min: 0,
        max: 60,
      },
    },
    elements: {
      point: {
        radius: 0,
        pointStyle: "circle",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Lingkar Kepala berdasarkan Umur",
      },
    },
  };

  const optionsGizi = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Berat badan (kg)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Panjang badan (cm)",
        },
        min: 0,
        max: 200,
      },
    },
    elements: {
      point: {
        radius: 0,
        pointStyle: "circle",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Berat badan berdasarkan Panjang badan",
      },
    },
  };

  useEffect(() => {
    function fetchDataPerkembanganAnak() {
      if (user.user.role !== "ORANG_TUA") {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/posyandu/statistik-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            const sortedData = response.data.data.sort((a, b) =>
              a.date.localeCompare(b.date)
            );

            setData(sortedData);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      } else {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/orang-tua/statistik-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            const sortedData = response.data.data.sort((a, b) =>
              a.date.localeCompare(b.date)
            );
            setData(sortedData);
            console.log(data);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      }
    }

    fetchDataPerkembanganAnak();

    // eslint-disable-next-line
  }, [refreshKey]);

  useEffect(() => {
    function fetchDataAnakByID() {
      if (user.user.role !== "ORANG_TUA") {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/posyandu/data-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            setDataAnak(response.data.data);
            // console.log(dataAnak)
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/orang-tua/data-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            setDataAnak(response.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    fetchDataAnakByID();
    // eslint-disable-next-line
  }, []);

  function deletePerkembanganAnak(id) {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/posyandu/statistik-anak/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token.value}` },
        }
      )
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const columns = [
    {
      title: "Tanggal Pengukuran",
      key: "date",
      dataIndex: "date",
      render: (date) => moment(date).format("DD MMMM YYYY"),
    },
    {
      title: "Umur",
      dataIndex: "date",
      key: "date",
      render: (tanggalPengukuran) =>
        `${monthDiff(
          moment(dataAnak.tanggal_lahir),
          moment(tanggalPengukuran)
        )} Bulan`,
    },
    {
      title: "Berat Badan",
      key: "berat",
      dataIndex: "berat",
      render: (berat) => `${berat} kg`,
    },
    {
      title: "Status - BB/U",
      key: "statusBB",
      dataIndex: ["statistik", "berat"],
    },
    {
      title: "Tinggi Badan",
      key: "tinggi",
      dataIndex: "tinggi",
      render: (tinggi) => `${tinggi} cm`,
    },
    {
      title: "Status - TB/U",
      key: "statusTB",
      dataIndex: ["statistik", "tinggi"],
    },
    {
      title: "Lingkar Kepala",
      key: "lingkar_kepala",
      dataIndex: "lingkar_kepala",
      render: (lingkar_kepala) => `${lingkar_kepala} cm`,
    },
    {
      title: "Status - LK/U",
      key: "statusLK",
      dataIndex: ["statistik", "lingkar_kepala"],
    },
    {
      title: "Status - Gizi",
      key: "statusGizi",
      dataIndex: ["statistik", "gizi"],
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">

    //       {user && user.user.role !== "ORANG_TUA" && (
    //         <button
    //           type="button"
    //           className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
    //           onClick={() => deletePerkembanganAnak(record.id)}
    //         >
    //           Delete
    //         </button>
    //       )}
    //     </Space>
    //   ),
    // },
  ];

  const [activeContent, setActiveContent] = useState("Content 1");

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  return (
    <>
      <Navbar isLogin />
      <BackgroundComponent />
      <div className="flex flex-col items-center p-4 sm:p-6 lg:p-8 w-full justify-center">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full max-w-[800px] items-center justify-center lg:h-[350px] h-auto mt-16 ">
          <div className="flex-1 text-left">
            <h6 className="dashboard text-2xl lg:text-5xl">{dataAnak.nama}</h6>
            <h6 className="dashboard text-2xl lg:text-5xl">{`${moment().diff(
              moment(dataAnak.tanggal_lahir),
              "month"
            )} Bulan`}</h6>
          </div>
          <div className="flex flex-1 justify-center">
            <Image
              style={{ width: "150px", height: "auto" }}
              src={bayi}
              className="rounded"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full max-w-[1200px] px-4 sm:px-6 overflow-x-auto mt-20">
          <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            pagination={{ pageSize: 7 }}
            className="ant-table"
          />
        </div>

        {/* Buttons Section */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center w-full max-w-[1200px] mt-4 sm:mt-6">
          <button
            className="button_detail text-sm sm:text-base px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("Content 1")}
          >
            Berat Badan
          </button>
          <button
            className="button_detail text-sm sm:text-base px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("Content 2")}
          >
            Tinggi Badan
          </button>
          <button
            className="button_detail text-sm sm:text-base px-4 py-2 rounded-lg "
            onClick={() => handleButtonClick("Content 3")}
          >
            Lingkar Kepala
          </button>
          <button
            className="button_detail text-sm sm:text-base px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("Content 4")}
          >
            Gizi
          </button>
        </div>

        {/* Chart Sections */}
        {activeContent === "Content 1" && (
          <div className="w-full max-w-[1200px] mt-6 sm:mt-8 border-2 p-4 border-black">
            <Line
              data={
                dataAnak.gender === "LAKI_LAKI"
                  ? dataChartPriaBB
                  : dataChartPerempuanBB
              }
              options={optionsBB}
            />
          </div>
        )}

        {activeContent === "Content 2" && (
          <div className="w-full max-w-[1200px] mt-6 sm:mt-8 border-2 p-4 border-black">
            <Line
              data={
                dataAnak.gender === "LAKI_LAKI"
                  ? dataChartPriaTB
                  : dataChartPerempuanTB
              }
              options={optionsTB}
            />
          </div>
        )}

        {activeContent === "Content 3" && (
          <div className="w-full max-w-[1200px] mt-6 sm:mt-8 border-2 p-4 border-black">
            <Line
              data={
                dataAnak.gender === "LAKI_LAKI"
                  ? dataChartPriaLK
                  : dataChartPerempuanLK
              }
              options={optionsLK}
            />
          </div>
        )}

        {activeContent === "Content 4" && (
          <div className="w-full max-w-[1200px] mt-6 sm:mt-8 border-2 p-4 border-black">
            <Line
              data={
                dataAnak.gender === "LAKI_LAKI"
                  ? moment().diff(moment(dataAnak.tanggal_lahir), "month") >=
                      0 &&
                    moment().diff(moment(dataAnak.tanggal_lahir), "month") <= 24
                    ? dataChartPriaGizi_0_24
                    : dataChartPriaGizi_25_60
                  : moment().diff(moment(dataAnak.tanggal_lahir), "month") >=
                      0 &&
                    moment().diff(moment(dataAnak.tanggal_lahir), "month") <= 24
                  ? dataChartPerempuanGizi_0_24
                  : dataChartPerempuanGizi_25_60
              }
              options={optionsGizi}
            />
          </div>
        )}

        {/* Modal Forms */}
        <FormInputPerkembanganAnak
          isOpen={isOpenModalInputPerkembanganAnak}
          onCancel={() => setIsOpenModalInputPerkembanganAnak(false)}
          data={dataAnak ? dataAnak : null}
          idAnak={id}
          fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
        />

        <FormUpdatePerkembanganAnak
          isOpen={isOpenModalUpdatePerkembanganAnak}
          onCancel={() => setIsOpenModalUpdatePerkembanganAnak(false)}
          fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
          data={dataPerkembanganAnak}
          profil={dataAnak}
        />
      </div>
    </>
  );
}
