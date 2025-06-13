import { Button, Col, Form, Input, message, Row, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

export default function InputPosyandu() {
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataDesa, setDataDesa] = useState([]);
  const [searchText, setSearchedText] = useState("");

  function deletePosyandu(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/posyandu/${id}`)
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const columns = [
    {
      title: "Nama Posyandu",
      dataIndex: "nama",
      key: "nama",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.nama).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Alamat",
      dataIndex: "alamat",
      key: "alamat",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => deletePosyandu(record.id)} type="dashed" danger>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu`)
      .then((response) => {
        setDataSource(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataDesa(response.data.data);
      })
      .catch((err) => {});
    // eslint-disable-next-line
  }, [refreshKey]);

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/posyandu`, {
        id_desa: values.desa,
        nama: values.posyandu,
        alamat: values.alamat,
      })
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
          <Col span={24}>
            <Form
              form={form}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="horizontal"
            >
              <Form.Item
                label="Pilih Desa"
                name="desa"
                rules={[
                  {
                    required: true,
                    message: "Desa masih kosong!",
                  },
                ]}
              >
                <Select listHeight={100} optionFilterProp="children" showSearch>
                  {dataDesa.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Nama Posyandu"
                name="posyandu"
                rules={[
                  {
                    required: true,
                    message: "Nama Posyandu masih kosong!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Alamat"
                name="alamat"
                rules={[
                  {
                    required: true,
                    message: "Alamat masih kosong!",
                  },
                ]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Col span={24}>
                {!isLoading && (
                  <Table
                    // title={() => <h1>Daftar Posyandu</h1>}
                    title={() => (
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center">
                          <h2 className="text-sm font-semibold">
                            Daftar Posyandu
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
                )}
              </Col>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Tambah posyandu
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
