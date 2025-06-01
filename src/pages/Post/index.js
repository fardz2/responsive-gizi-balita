import { List, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import avatar from "../../assets/icon/user.png";
import { Link } from "react-router-dom";
import "./post-style.css";

export default function Post() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataPost, setDataPost] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/post`)
      .then((response) => {
        setIsLoading(false);
        const sortedData = response.data.data.sort((a, b) =>
          b.time.localeCompare(a.time)
        );
        setDataPost(sortedData);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  const data =
    !isLoading &&
    dataPost.map((item) => ({
      href: `/tenaga-kesehatan/detail/${item.post_id}`,
      title: item.title,
      avatar: avatar,
      description: item.nama,
      role: item.role,
      content: moment(item.time).format("DD MMMM YYYY"),
    }));

  return (
    <>
      <Navbar isLogin />
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-center mt-6 sm:mt-8 lg:mt-10">
          <Spin size="large" spinning={isLoading} />
        </div>
        <div className="w-full flex justify-center mt-4 sm:mt-6">
          {!isLoading && (
            <List
              className="w-full  px-4 sm:px-6"
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 4,
                className: "flex justify-center mt-4",
              }}
              dataSource={data}
              renderItem={(item) => (
                <div className="flex bg-gray-50 shadow-lg rounded-2xl my-4 sm:my-5 w-full max-w-[900px] mx-auto">
                  <div className="flex items-start px-4 py-4 sm:px-6 sm:py-6 w-full">
                    <div className="w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mt-1">
                          <a href={item.href}>{item.title}</a>
                        </h2>
                        <div>{item.asnwer}</div>
                      </div>
                      <p className="text-gray-800 text-sm sm:text-base mt-1">
                        {item.description} (
                        <span className="text-blue-600">
                          {item.role === "ORANG_TUA"
                            ? "orang tua"
                            : "tenaga kesehatan"}
                        </span>
                        )
                      </p>
                      <p className="mt-2 sm:mt-3 text-gray-700 text-xs sm:text-sm">
                        {item.content}
                      </p>
                      <Link to={item.href}>
                        <button className="cta mt-3 sm:mt-4">
                          <span>Jawab</span>
                          <svg viewBox="0 0 13 10" height="10px" width="15px">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
}
