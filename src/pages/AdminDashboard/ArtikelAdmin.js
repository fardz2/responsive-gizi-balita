import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import FormUpdateDataArtikel from "../../components/form/FormUpdateDataArtikel";
import { formatDate2 } from "../../utilities/Format";
import { FiRotateCcw } from "react-icons/fi";

export default function ArtikelAdmin() {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(localStorage.getItem("login_data")) || {};
  }
  const [user, setUser] = useState(login_data);
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState(null);
  const [dataKategori, setDataKategori] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataArtikel, setDataArtikel] = useState(null);
  const [valueContent, setValueContent] = useState("");
  const [statePage, setStatePage] = useState("Artikel");
  const [isOpenModalUpdateDataArtikel, setIsOpenModalUpdateDataArtikel] =
    useState(false);
  const [searchText, setSearchedText] = useState("");
  const [statePageKateogries, setStatePageKateogries] = useState(false);

  // Validate image file
  const validateImage = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    if (!file) {
      return Promise.reject(new Error("Cover masih kosong!"));
    }
    if (!validTypes.includes(file.type)) {
      return Promise.reject(
        new Error(
          "Format file tidak valid! Hanya JPEG, PNG, JPG, GIF, atau SVG yang diperbolehkan."
        )
      );
    }
    if (file.size > maxSize) {
      return Promise.reject(new Error("Ukuran file maksimal 2MB!"));
    }
    return Promise.resolve();
  };

  const onFinish = (values) => {
    if (!statePageKateogries) {
      if (imageFile) {
        let formData = new FormData();
        formData.append("judul", values.judul);
        formData.append("kategori", values.kategori);
        formData.append("penulis", values.penulis);
        formData.append("content", valueContent);
        formData.append("image", imageFile);

        axios
          .post(`${process.env.REACT_APP_BASE_URL}/api/artikel`, formData, {
            headers: {
              Authorization: `Bearer ${user.token?.value}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            setRefreshKey((oldKey) => oldKey + 1);
            messageApi.open({
              type: "success",
              content: "Data berhasil tersimpan",
            });
            form.resetFields();
            setValueContent("");
            setImageFile(null);
          })
          .catch((err) => {
            console.error(err);
            messageApi.open({
              type: "error",
              content: err.response?.data?.message || "Data gagal tersimpan",
            });
          });
      } else {
        messageApi.open({
          type: "error",
          content: "Silakan unggah cover artikel terlebih dahulu!",
        });
      }
    } else {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/kategori`, values, {
          headers: { Authorization: `Bearer ${user.token?.value}` },
        })
        .then(() => {
          setRefreshKey((oldKey) => oldKey + 1);
          messageApi.open({
            type: "success",
            content: "Data berhasil tersimpan",
          });
          form.resetFields();
          setValueContent("");
          setImageFile(null);
        })
        .catch((err) => {
          console.error(err);
          messageApi.open({
            type: "error",
            content: err.response?.data?.message || "Data gagal tersimpan",
          });
        });
    }
  };

  const onFinishFailed = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "Judul Berita",
      dataIndex: "judul",
      key: "judul",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.judul).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Tanggal Upload",
      dataIndex: "kategori",
      key: "kategori",
      render: (_, record) => formatDate2(record.updated_at),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex">
          <button
            type="button"
            className="buttonUpdateArtikel"
            onClick={() => {
              setDataArtikel(record);
              setIsOpenModalUpdateDataArtikel(true);
            }}
          >
            Update
          </button>
          <button
            type="button"
            className="buttonDeleteArtikel"
            onClick={() => {
              Modal.confirm({
                title: "Apakah anda yakin?",
                icon: <ExclamationCircleOutlined />,
                content: "Data yang dihapus tidak dapat dikembalikan",
                okText: "Ya",
                cancelText: "Tidak",
                onOk: () => {
                  deleteDesa(record.id);
                },
              });
            }}
          >
            Delete
          </button>
        </div>
      ),
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
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/artikel`, {
        headers: { Authorization: `Bearer ${user.token?.value}` },
      })
      .then((response) => {
        setDataSource(response.data.data);
        setStatePage("Artikel");
        setStatePageKateogries(false);
      })
      .catch((err) => {
        console.error(err);
        messageApi.open({
          type: "error",
          content: "Gagal mengambil data artikel",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/kategori`, {
        headers: { Authorization: `Bearer ${user.token?.value}` },
      })
      .then((response) => {
        setDataKategori(response.data.data);
      })
      .catch((err) => {
        console.error(err);
        messageApi.open({
          type: "error",
          content: "Gagal mengambil data kategori",
        });
      });
  }, [refreshKey, user.token?.value, messageApi]);

  function deleteDesa(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/artikel/${id}`, {
        headers: { Authorization: `Bearer ${user.token?.value}` },
      })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Data berhasil dihapus",
        });
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.error(err);
        messageApi.open({
          type: "error",
          content: "Data gagal dihapus",
        });
      });
  }

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
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginBottom: "20px",
              }}
            >
              <button
                className="button_kirim"
                onClick={() => setStatePage("Artikel")}
              >
                Artikel
              </button>
              <button
                className="button_kirim"
                onClick={() => setStatePage("Riwayat")}
              >
                Riwayat
              </button>
            </div>
          </Col>
          <Col span={24}>
            {statePage === "Artikel" ? (
              <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="horizontal"
              >
                <Form.Item
                  label="Pilih kategori"
                  name="kategori"
                  rules={[
                    { required: true, message: "Kategori masih kosong!" },
                  ]}
                >
                  <Select
                    size="4"
                    listHeight={100}
                    optionFilterProp="children"
                    showSearch
                    placeholder="Pilih Kategori"
                  >
                    <Select.Option value="add">
                      <Button onClick={() => setStatePageKateogries(true)}>
                        Tambah Kategori
                      </Button>
                    </Select.Option>
                    {statePageKateogries ? (
                      <Select.Option></Select.Option>
                    ) : (
                      dataKategori.map((item) => (
                        <Select.Option key={item.id} value={item.name}>
                          {item.name}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                </Form.Item>
                {statePageKateogries && (
                  <Form.Item
                    style={{ width: "100%" }}
                    label="Tambah Kategori"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Nama Kategori masih kosong!",
                      },
                    ]}
                  >
                    <Input placeholder="Masukkan Nama Kategori" />
                  </Form.Item>
                )}
                {!statePageKateogries && (
                  <>
                    <Form.Item
                      style={{ width: "100%" }}
                      label="Judul"
                      name="judul"
                      rules={[
                        { required: true, message: "Judul masih kosong!" },
                      ]}
                    >
                      <Input placeholder="Masukkan judul" />
                    </Form.Item>
                    <Form.Item
                      style={{ width: "100%" }}
                      label="Nama penulis"
                      name="penulis"
                      rules={[
                        { required: true, message: "Penulis masih kosong!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      style={{ width: "100%" }}
                      label="Unggah cover artikel"
                      name="image"
                      rules={[
                        {
                          validator: (_, value) => validateImage(imageFile),
                        },
                      ]}
                    >
                      <div className="flex justify-center items-center w-full">
                        <label
                          htmlFor="import_pelanggan"
                          className="flex flex-col justify-center items-center w-full h-64 bg-white rounded-lg border-2 border-dashed cursor-pointer"
                          style={{ borderColor: "#FFB4B4" }}
                        >
                          {imageFile ? (
                            <div className="flex flex-col justify-center items-center w-full h-full">
                              {imageFile?.name}
                            </div>
                          ) : (
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                              <svg
                                aria-hidden="true"
                                className="mb-3 w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                              </svg>
                              <p
                                className="mb-2 text-sm"
                                style={{ color: "#b41318" }}
                              >
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#b41318" }}
                              >
                                JPEG, PNG, JPG, GIF, SVG (Maks. 2MB)
                              </p>
                            </div>
                          )}
                          <input
                            id="import_pelanggan"
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.svg"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                validateImage(file)
                                  .then(() => {
                                    setImageFile(file);
                                    form.validateFields(["image"]);
                                  })
                                  .catch((error) => {
                                    messageApi.open({
                                      type: "error",
                                      content: error.message,
                                    });
                                    setImageFile(null);
                                    form.validateFields(["image"]);
                                  });
                              } else {
                                setImageFile(null);
                                form.validateFields(["image"]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </Form.Item>
                    <Form.Item
                      style={{ width: "100%", flexDirection: "row" }}
                      label="Paragraf"
                      name="content"
                      rules={[
                        {
                          validator: (_, value) =>
                            valueContent
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("Konten masih kosong!")
                                ),
                        },
                      ]}
                    >
                      <ReactQuill
                        theme="snow"
                        value={valueContent}
                        onChange={setValueContent}
                      />
                    </Form.Item>
                  </>
                )}
                <Col span={24} align="center">
                  <Form.Item>
                    <button type="submit" className="button_kirim mx-5">
                      {statePageKateogries
                        ? "Tambah kategori"
                        : "Tambah artikel"}
                    </button>
                    {statePageKateogries && (
                      <button
                        type="primary"
                        className="button_kirim mx-5"
                        onClick={() => setStatePageKateogries(false)}
                      >
                        Batal
                      </button>
                    )}
                  </Form.Item>
                </Col>
              </Form>
            ) : (
              !isLoading && (
                <div className="overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold">Daftar Artikel</h2>
                    <Input.Search
                      placeholder="Search here ..."
                      onSearch={(value) => setSearchedText(value)}
                      className="w-full sm:w-64"
                    />
                  </div>
                  <Table
                    title={() => (
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center">
                          <h2 className="text-sm font-semibold">
                            Daftar Artikel
                          </h2>
                        </div>
                        <div className="flex justify-end items-center">
                          <Input.Search
                            placeholder="Search here ..."
                            onSearch={(value) => setSearchedText(value)}
                            className="w-full sm:w-64"
                          />
                        </div>
                      </div>
                    )}
                    dataSource={dataSource}
                    columns={columns}
                    loading={isLoading}
                    pagination={{ pageSize: 5 }}
                    className="w-full"
                    scroll={{ x: "max-content" }}
                  />
                  <div className="flex justify-center mt-4">
                    <button
                      className="button_kirim"
                      onClick={() => setRefreshKey((oldKey) => oldKey + 1)}
                    >
                      <FiRotateCcw />
                    </button>
                  </div>
                </div>
              )
            )}
          </Col>
          <Col>
            <FormUpdateDataArtikel
              isOpen={isOpenModalUpdateDataArtikel}
              onCancel={() => setIsOpenModalUpdateDataArtikel(false)}
              fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
              data={dataArtikel}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
