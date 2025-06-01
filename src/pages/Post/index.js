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
          <Link to="/my-forum">
            <button className="cssbuttons-io-button" type="button">
              Pertanyaan
              <div className="icon">
                <svg
                  width="49"
                  height="48"
                  viewBox="0 0 49 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31 7C31 3.41015 28.0899 0.5 24.5 0.5C20.9101 0.5 18 3.41015 18 7V17.75H7.25C3.66015 17.75 0.75 20.6601 0.75 24.25C0.75 27.8398 3.66015 30.75 7.25 30.75H18V41.5C18 45.0899 20.9101 48 24.5 48C28.0899 48 31 45.0899 31 41.5V30.75H41.75C45.3399 30.75 48.25 27.8399 48.25 24.25C48.25 20.6601 45.3399 17.75 41.75 17.75H31V7Z"
                    fill="#FF9999"
                  />
                </svg>
              </div>
            </button>
          </Link>
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
