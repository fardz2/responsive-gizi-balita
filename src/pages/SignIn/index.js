import { Col, Form, Input, message, Row, Spin } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import logo from "./GiziBalita_logo.png";
import background from "./login_bg.svg";
import banner from "./banner.svg";

const BackgroundComponent = () => (
  <div
    className="fixed inset-0 z-[-10000] bg-center bg-no-repeat"
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover", // Ensures the image covers the entire area
      backgroundPosition: "center",
      minHeight: "100vh", // Ensures full viewport height
    }}
  />
);

export default function SignIn(props) {
  const { TenagaKesehatan, Desa, kaderPosyandu, admin } = props;
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, {
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        const role_user = response.data.data.user.role;
        messageApi.open({
          type: "success",
          content: "Berhasil Login",
        });
        localStorage.setItem("login_data", JSON.stringify(response.data.data));
        setTimeout(() => {
          setLoading(false);
          if (role_user === "ORANG_TUA") {
            navigate("/dashboard/");
          } else if (role_user === "KADER_POSYANDU") {
            navigate("/kader-posyandu/dashboard/");
          } else if (role_user === "TENAGA_KESEHATAN") {
            navigate("/tenaga-kesehatan/dashboard");
          } else if (role_user === "DESA") {
            navigate("/desa/dashboard");
          } else if (role_user === "ADMIN") {
            navigate("/admin/dashboard/desa");
          }
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        messageApi.open({
          type: "error",
          content: "Email dan Password belum sesuai",
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const renderLoginForm = () => (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto p-4 h-screen items-center"
      style={{ background: "rgba(0, 0, 0, 0)" }}
    >
      <div className="flex flex-col items-center justify-center">
        <img
          src={logo}
          alt="Image"
          className="w-40 md:w-48 mb-2"
          style={{ height: "auto" }}
        />
        <div className="w-full max-w-md">
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{ fontSize: "20px" }}
          >
            <h5 className="label">Email</h5>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email masih kosong!" },
                { type: "email", message: "Email belum sesuai!" },
              ]}
            >
              <Input
                id="input_signIn"
                placeholder="user@email.com"
                prefix={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "4px",
                    }}
                  >
                    <MailOutlined style={{ marginRight: "8px" }} />
                    <span style={{ margin: "0 8px" }}>|</span>
                  </span>
                }
                style={{
                  borderRadius: "20px",
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                }}
              />
            </Form.Item>

            <h5 className="label">Password</h5>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password masih kosong!" }]}
            >
              <Input.Password
                id="input_signIn"
                placeholder="password"
                prefix={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "4px",
                    }}
                  >
                    <KeyOutlined style={{ marginRight: "8px" }} />
                    <span style={{ margin: "0 8px" }}>|</span>
                  </span>
                }
                style={{
                  borderRadius: "20px",
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                }}
              />
            </Form.Item>

            <Form.Item>
              <button
                type="submit"
                className="button__"
                style={{
                  fontSize: "22px",
                  height: 50,
                  borderRadius: "20px",
                  marginBottom: "20px",
                }}
                disabled={loading}
              >
                LOGIN
              </button>
            </Form.Item>
          </Form>
          <p className="text-center mt-2">
            Tidak punya akun? <Link to="/sign-up">Daftar</Link>
          </p>
        </div>
      </div>
      <div
        className="hidden md:flex items-center justify-center"
        style={{
          background: `url(${banner}) no-repeat center`,
          backgroundSize: "700px",
          borderRadius: 10,
          height: "90%",
        }}
      />
    </div>
  );

  const renderTenagaKesehatanForm = () => (
    <div
      className="flex items-center justify-center h-screen"
      style={{ background: "linear-gradient(42deg,#090979,#00d4ff)" }}
    >
      <div className="w-full max-w-md bg-white rounded-lg p-6 md:p-8">
        <h1 className="font-bold text-2xl my-5 text-center">Welcome back</h1>
        <p className="text-center mb-4">login sebagai Tenaga Kesehatan</p>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email masih kosong!" },
              { type: "email", message: "Email belum sesuai!" },
            ]}
          >
            <Input placeholder="user@email.com" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password masih kosong!" }]}
          >
            <Input.Password placeholder="password" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              disabled={loading}
            >
              Login
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );

  return (
    <>
      <BackgroundComponent />
      {contextHolder}
      {loading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white/80 p-8 rounded-lg">
          <Spin size="large" />
        </div>
      )}
      {!TenagaKesehatan &&
        !Desa &&
        !kaderPosyandu &&
        !admin &&
        renderLoginForm()}
      {kaderPosyandu && renderLoginForm()}
      {Desa && renderLoginForm()}
      {TenagaKesehatan && renderTenagaKesehatanForm()}
      {admin && renderLoginForm()}
    </>
  );
}
