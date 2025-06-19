import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
  Modal,
} from "antd";
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  function deletePosyandu(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/posyandu/${id}`)
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
        messageApi.open({
          type: "success",
          content: "Posyandu berhasil dihapus",
        });
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: err.response?.data?.message || "Gagal menghapus posyandu",
        });
      });
  }

  const showDeleteConfirm = (id, nama) => {
    Modal.confirm({
      title: "Konfirmasi Hapus",
      content: `Apakah Anda yakin ingin menghapus posyandu "${nama}"?`,
      okText: "Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk() {
        deletePosyandu(id);
      },
      onCancel() {
        console.log("Hapus dibatalkan");
      },
    });
  };

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
        <Button
          onClick={() => showDeleteConfirm(record.id, record.nama)}
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
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu`)
      .then((response) => {
        setDataSource(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Gagal mengambil data posyandu",
        });
        setIsLoading(false);
      });

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
  }, [refreshKey, messageApi]);

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/posyandu`, {
        id_desa: values.desa,
        nama: values.posyandu,
        alamat: values.alamat,
      })
      .then((response) => {
        messageApi.open({
          type: "success",
          content: "Posyandu berhasil disimpan",
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
              Tambah Posyandu
            </Button>
            <Modal
              title="Tambah Posyandu"
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
                  label="Pilih Desa"
                  name="desa"
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
                  >
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
                      <h2 className="text-sm font-semibold">Daftar Posyandu</h2>
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
