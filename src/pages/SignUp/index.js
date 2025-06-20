import { Button, Form, Input, message, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "../SignIn/banner.svg";
import logo from "../SignIn/GiziBalita_logo.png";
import background from "../SignIn/login_bg.svg";

const BackgroundComponent = () => (
  <div
    className="fixed inset-0 z-[-10000] bg-center bg-no-repeat bg-cover "
    style={{ backgroundImage: `url(${background})` }}
  />
);

export default function SignUp() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState(3);
  const [dataDesa, setDataDesa] = useState(null);
  const [dataPosyandu, setDataPosyandu] = useState(null);

  // Check if user is already authenticated
  useEffect(() => {
    let login_data = null;
    let isAuthenticated = false;
    let userRole = null;

    try {
      if (typeof window !== "undefined") {
        login_data = JSON.parse(localStorage.getItem("login_data") || "{}");
        isAuthenticated =
          login_data &&
          login_data.token &&
          login_data.user &&
          login_data.user.role;
        userRole = isAuthenticated ? login_data.user.role : null;
      }
    } catch (error) {
      console.error("Error parsing login_data:", error);
      localStorage.removeItem("login_data"); // Clear invalid data
      isAuthenticated = false;
    }

    if (isAuthenticated) {
      // Redirect to role-specific dashboard
      const redirectPath =
        userRole === "ORANG_TUA"
          ? "/dashboard"
          : userRole === "KADER_POSYANDU"
          ? "/kader-posyandu/dashboard"
          : userRole === "TENAGA_KESEHATAN"
          ? "/tenaga-kesehatan/dashboard"
          : userRole === "DESA"
          ? "/desa/dashboard"
          : userRole === "ADMIN"
          ? "/admin/dashboard/desa"
          : "/"; // Fallback to home if role is unknown

      messageApi.open({
        type: "info",
        content: "Anda sudah login. Mengarahkan ke dashboard...",
      });

      navigate(redirectPath, { replace: true });
    }
  }, [navigate, messageApi]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataDesa(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu`)
      .then((response) => {
        setDataPosyandu(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onFinish = (values) => {
    if (values && role === 4) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/posyandu/register`, {
          nama: values.nama,
          email: values.email,
          password: values.password,
          id_desa: values.desa,
          id_posyandu: values.posyandu,
        })
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Register Berhasil",
          });
          setTimeout(() => {
            navigate("/sign-in");
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: "Gagal Registrasi",
          });
        });
    }

    if (values && role === 3) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/orang-tua/register`, {
          nama: values.nama,
          email: values.email,
          password: values.password,
          id_desa: values.desa,
          id_posyandu: values.posyandu,
          alamat: values.alamat, // Include alamat for ORANG_TUA
        })
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Register Berhasil",
          });
          setTimeout(() => {
            navigate("/sign-in");
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: "Gagal Registrasi",
          });
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <BackgroundComponent />
      <div
        className="flex items-center justify-center min-h-screen p-2 sm:p-4"
        style={{ background: "transparent" }}
      >
        <div
          className="w-full max-w-sm sm:max-w-md rounded-[20px] p-4 sm:p-6"
          style={{
            background:
              "linear-gradient(137deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
            boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.20)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex flex-col items-center">
            <img
              src={logo}
              alt="Image"
              className="w-32 sm:w-40 md:w-48 mb-2"
              style={{ height: "auto" }}
            />
            <Form
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              className="w-full"
            >
              <Form.Item
                label="Role"
                name="role"
                initialValue={role}
                rules={[{ required: true, message: "Pilih role!" }]}
              >
                <Select
                  placeholder="Pilih Role"
                  onChange={(value) => setRole(value)}
                >
                  <Select.Option value={3}>Orang Tua</Select.Option>
                  <Select.Option value={4}>Kader Posyandu</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Nama"
                name="nama"
                rules={[
                  {
                    required: true,
                    message: "Nama masih kosong!",
                    type: "string",
                  },
                ]}
              >
                <Input placeholder="Nama Lengkap" />
              </Form.Item>

              {role === 3 && (
                <Form.Item
                  label="Alamat"
                  name="alamat"
                  rules={[
                    {
                      required: true,
                      message: "Alamat masih kosong!",
                      type: "string",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              )}

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email masih kosong!" },
                  { type: "email", message: "Email belum sesuai!" },
                ]}
              >
                <Input placeholder="user@email.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password masih kosong!" },
                  {
                    pattern: "^.{8,}$",
                    message: "Password minimal 8 karakter",
                  },
                ]}
              >
                <Input.Password placeholder="password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirm"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Silahkan Confirm Password Anda!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Password tidak sesuai!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item
                name="desa"
                label="Desa"
                rules={[{ required: true, message: "Pilih Desa!" }]}
              >
                <Select placeholder="Pilih Desa" allowClear>
                  {dataDesa &&
                    dataDesa.map((value) => (
                      <Select.Option key={value.id} value={value.id}>
                        {value.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="posyandu"
                label="Posyandu"
                rules={[{ required: true, message: "Pilih Posyandu!" }]}
              >
                <Select placeholder="Pilih Posyandu" allowClear>
                  {dataPosyandu &&
                    dataPosyandu.map((value) => (
                      <Select.Option key={value.id} value={value.id}>
                        {value.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <button
                  htmlType="submit"
                  className="button__"
                  style={{
                    fontSize: "22px",
                    height: 50,
                    borderRadius: "20px",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                >
                  Daftar
                </button>
              </Form.Item>
            </Form>
            <p className="text-center">
              Sudah punya akun? <Link to="/sign-in">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
