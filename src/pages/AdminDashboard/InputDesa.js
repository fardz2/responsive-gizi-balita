import { Button, Col, Form, Input, message, Row, Table } from "antd";
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

  function deleteDesa(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/desa/${id}`)
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
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
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, [refreshKey]);

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/desa`, { nama: values.desa })
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
        form.resetFields();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Data gagal tersimpan",
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
              <Form.Item
                style={{ Width: "100%" }}
                label="Nama Desa"
                name="desa"
                rules={[
                  {
                    required: true,
                    message: "Nama Desa masih kosong!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Col span={24}>
                {!isLoading && (
                  <>
                    <Table
                      // title={() => <h1>Daftar Desa</h1>}
                      title={() => (
                        <div className="flex justify-between items-center">
                          <div className="flex justify-start items-center">
                            <h2 className="text-sm font-semibold">
                              Daftar Desa
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
                      dataSource={dataSource}
                      columns={columns}
                      loading={isLoading}
                      pagination={{ pageSize: 5 }}
                    />
                  </>
                )}
              </Col>

              <Col span={24} align="center">
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Tambah desa
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
