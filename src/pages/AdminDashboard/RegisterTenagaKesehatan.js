import { Button, Col, Form, Input, message, Row, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import "./Search.css";

export default function RegisterTenagaKesehatan() {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]); // Posyandu data
  const [tenagaKesehatanData, setTenagaKesehatanData] = useState([]); // Tenaga Kesehatan data
  const [dataDesa, setDataDesa] = useState([]); // Desa data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [refreshKey, setRefreshKey] = useState(0); // Refresh key for refetching
  const [searchText, setSearchedText] = useState(""); // Search text for filtering
  const [messageApi, contextHolder] = message.useMessage();
  const [user] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("login_data")) || {};
    }
    return {};
  });

  // Function to delete a Tenaga Kesehatan
  function deleteTenagaKesehatan(id) {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/posyandu/tenaga-kesehatan/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token?.value}` },
        }
      )
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1); // Trigger refetch
        messageApi.open({
          type: "success",
          content: "Tenaga Kesehatan berhasil dihapus",
        });
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Gagal menghapus Tenaga Kesehatan",
        });
      });
  }

  // Table columns configuration
  const columns = [
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      filteredValue: [searchText],
      onFilter: (value, record) =>
        String(record.nama).toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Desa",
      dataIndex: ["desa", "name"],
      key: "desa",
      render: (text) => text || "N/A",
    },
    {
      title: "Posyandu",
      dataIndex: ["posyandu", "nama"],
      key: "posyandu",
      render: (text) => text || "N/A",
    },
  ];

  useEffect(() => {
    if (!user.token?.value) {
      messageApi.open({
        type: "error",
        content: "Silakan login terlebih dahulu",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Fetch posyandu data
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu`)
      .then((response) => {
        setDataSource(response.data.data);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Gagal mengambil data posyandu",
        });
      });

    // Fetch desa data
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataDesa(response.data.data);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Gagal mengambil data desa",
        });
      });

    // Fetch tenaga kesehatan data
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu/tenaga-kesehatan`, {
        headers: { Authorization: `Bearer ${user.token?.value}` },
      })
      .then((response) => {
        setTenagaKesehatanData(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Gagal mengambil data Tenaga Kesehatan",
        });
        setIsLoading(false);
      });
  }, [refreshKey, messageApi, user.token?.value]);

  const onFinish = (values) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/tenaga-kesehatan/register`,
        {
          nama: values.nama,
          email: values.email,
          password: values.password,
          id_desa: values.desa,
          id_posyandu: values.posyandu,
        }
      )
      .then((response) => {
        messageApi.open({
          type: "success",
          content: "Register Berhasil",
        });
        form.resetFields();
        setRefreshKey((oldKey) => oldKey + 1); // Trigger refetch
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error.response?.data?.message || "Gagal Registrasi",
        });
      });
  };

  const onFinishFailed = (values) => {
    console.log(values);
  };

  return (
    <>
      <Container
        fluid
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        {contextHolder}
        <Row justify="space-between">
          <Col sm={24}>
            <Form
              form={form}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="horizontal"
            >
              <div className="flex justify-start items-center mb-4">
                <h2 className="text-sm font-semibold">
                  Registrasi Tenaga Kesehatan
                </h2>
              </div>
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

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email masih kosong!",
                  },
                  {
                    type: "email",
                    message: "Email belum sesuai!",
                  },
                ]}
              >
                <Input placeholder="user@email.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password masih kosong!",
                  },
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
                rules={[
                  {
                    required: true,
                    message: "Desa masih kosong!",
                  },
                ]}
              >
                <Select
                  listHeight={100}
                  optionFilterProp="children"
                  showSearch
                  placeholder="Pilih Desa"
                >
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
                rules={[
                  {
                    required: true,
                    message: "Posyandu masih kosong!",
                  },
                ]}
              >
                <Select
                  listHeight={100}
                  optionFilterProp="children"
                  showSearch
                  placeholder="Pilih Posyandu"
                >
                  {dataSource &&
                    dataSource.map((value) => (
                      <Select.Option key={value.id} value={value.id}>
                        {value.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Col span={24} align="center">
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Tambah tenaga kesehatan
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>

        {/* Table for displaying Tenaga Kesehatan */}
        <Row justify="space-between" style={{ marginTop: "20px" }}>
          <Col sm={24}>
            {!isLoading && (
              <Table
                title={() => (
                  <div className="flex justify-between items-center">
                    <div className="flex justify-start items-center">
                      <h2 className="text-sm font-semibold">
                        Daftar Tenaga Kesehatan
                      </h2>
                    </div>
                    <div className="flex justify-end items-center">
                      <Input.Search
                        placeholder="Search here ..."
                        onSearch={(value) => {
                          setSearchedText(value);
                        }}
                      />
                    </div>
                  </div>
                )}
                dataSource={tenagaKesehatanData}
                columns={columns}
                loading={isLoading}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                locale={{
                  emptyText: "Tidak ada data Tenaga Kesehatan",
                }}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
