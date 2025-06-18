import { Button, Col, Form, Input, message, Row, Table, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { FiRotateCcw } from "react-icons/fi";
import "./Search.css";

export default function InputDesa() {
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchedText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  function deleteDesa(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/desa/${id}`)
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
        messageApi.open({
          type: "success",
          content: "Desa berhasil dihapus",
        });
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: err.response?.data?.message || "Gagal menghapus desa",
        });
      });
  }

  const columns = [
    {
      title: "Nama Desa",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.name).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          className="button_delete"
          onClick={() => deleteDesa(record.id)}
          type="dashed"
          danger
        >
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataSource(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Gagal mengambil data desa",
        });
        setIsLoading(false);
      });
  }, [refreshKey, messageApi]);

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/desa`, {
        name: values.name,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      .then((response) => {
        messageApi.open({
          type: "success",
          content: "Desa dan akun berhasil disimpan",
        });
        setRefreshKey((oldKey) => oldKey + 1);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: err.response?.data?.message || "Data gagal tersimpan",
        });
        console.error("Error saving data:", err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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
          <Col span={24}>
            <Button
              type="primary"
              onClick={showModal}
              style={{ marginBottom: 16 }}
            >
              Tambah Desa
            </Button>
            <Modal
              title="Tambah Desa"
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Nama Desa"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Nama Desa masih kosong!",
                    },
                  ]}
                >
                  <Input />
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
                      min: 8,
                      message: "Password minimal 8 karakter",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="password_confirmation"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Silakan konfirmasi password!",
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
                  <Input.Password placeholder="Konfirmasi Password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Simpan
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                    Batal
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
            {!isLoading && (
              <Table
                title={() => (
                  <div className="flex justify-between items-center">
                    <div className="flex justify-start items-center">
                      <h2 className="text-sm font-semibold">Daftar Desa</h2>
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
                dataSource={dataSource}
                columns={columns}
                loading={isLoading}
                pagination={{ pageSize: 5 }}
                rowKey="id"
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
