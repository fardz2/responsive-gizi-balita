import { Avatar, Col, Row } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import ic_logout from "../../../assets/icon/log-out.png";
import "./index.css";
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import "/node_modules/bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../../../assets/img/GiziBalita_logo.png";

function BasicExample() {
  const navbarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFB4B4", // Replace with your custom color
    color: "#ffffff", // Replace with your custom text color
    height: "80px",
    paddingTop: "20px",
  };
  return (
    <Navbar style={navbarStyle} expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={Logo}
            alt="Image"
            style={{
              width: "180px",
              height: "auto",
              marginBottom: "10px",
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
          style={{ backgroundColor: "#FFB4B4" }}
        >
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/dashboard">
              <h5 style={{ color: "white" }}>Home</h5>
            </Nav.Link>
            <Nav.Link href="/">
              <h5 style={{ color: "white" }}>About</h5>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default function NavbarComp(props) {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  const { isLogin } = props;
  const { admin } = props;
  const { posyandu } = props;
  const { desa } = props;
  const { kader } = props;
  const { tenkes } = props;
  let navigate = useNavigate();
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);

  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveLink(currentPath);
  }, []);

  if (isLogin) {
    return (
      // <Row className="container" justify="center" align="middle">
      //   <Col span={user.user.role === "ORANG_TUA" ? 14 : 18}>
      //     <div className="title-header">
      //       Gizi<span style={{ color: "#1890ff" }}>Balita</span>
      //     </div>
      //   </Col>
      //   {user.user.role === "ORANG_TUA" && (
      //     <>
      //       <Col span={2}>
      //         <Link to="/dashboard">Dashboard</Link>
      //       </Col>
      //       <Col span={2}>
      //         <Link to="/forum">Forum</Link>
      //       </Col>
      //       <Col span={2}>
      //         <Link to="/my-forum">My Post</Link>
      //       </Col>
      //     </>
      //   )}
      //   <Col span={3}>
      // <Row justify="start" align="middle">
      //   <Col>
      //     <Row justify="end" style={{ fontWeight: "bold" }}>
      //       {user && user.user.name}
      //     </Row>
      //     <Row justify="end">{user && user.user.role.toLowerCase()}</Row>
      //   </Col>
      //   <Col span={6}>
      //     <Row justify="end">
      //       <Avatar icon={<UserOutlined />} />
      //     </Row>
      //   </Col>
      // </Row>
      // </Col>
      // <Col span={1}>
      //   <img
      //     style={{ cursor: "pointer" }}
      //     onClick={() => {
      //       navigate("/");
      //       localStorage.removeItem("login_data");
      //     }}
      //     src={ic_logout}
      //     width={32}
      //     height={32}
      //     alt=""
      //   />
      // </Col>
      // </Row>
      <Navbar
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFB4B4", // Replace with your custom color
          color: "#ffffff", // Replace with your custom text color
          height: "80px",
          paddingTop: "20px",
        }}
        expand="lg"
      >
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={Logo}
              alt="Image"
              style={{
                width: "180px",
                height: "auto",
                marginBottom: "10px",
              }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-start"
            style={{ backgroundColor: "#FFB4B4" }}
          >
            <Nav className="mx-auto align-items-center">
              {user.user.role === "ORANG_TUA" && (
                <>
                  <Nav.Link
                    href="/dashboard"
                    className={`nav-link ${
                      activeLink === "/dashboard" ? "active" : ""
                    }`}
                  >
                    <h6 className="nav-link-text">Home</h6>
                  </Nav.Link>
                  <Nav.Link
                    href="/artikel"
                    className={`nav-link ${activeLink === "/" ? "active" : ""}`}
                  >
                    <h6 className="nav-link-text">Artikel</h6>
                  </Nav.Link>
                  <Nav.Link
                    href="/forum"
                    className={`nav-link ${
                      activeLink === "/forum" ? "active" : ""
                    }`}
                  >
                    <h6 className="nav-link-text">Form</h6>
                  </Nav.Link>
                </>
              )}
              {user.user.role === "TENAGA_KESEHATAN" && (
                <>
                  <Nav.Link
                    href="/tenaga-kesehatan/dashboard"
                    className={`nav-link ${
                      activeLink === "/dashboard" ? "active" : ""
                    }`}
                  >
                    <h6 className="nav-link-text">Home</h6>
                  </Nav.Link>
                  <Nav.Link
                    href="/forum"
                    className={`nav-link ${
                      activeLink === "/forum" ? "active" : ""
                    }`}
                  >
                    <h6 className="nav-link-text">Form</h6>
                  </Nav.Link>
                </>
              )}
              {user.user.role === "DESA" && (
                <>
                  <Nav.Link
                    href="/desa/dashboard"
                    className={`nav-link ${
                      activeLink === "/dashboard" ? "active" : ""
                    }`}
                  >
                    <h6 className="nav-link-text">Home</h6>
                  </Nav.Link>
                  <Nav.Link
                    href="/desa/reminder"
                    className={`nav-link ${
                      activeLink === "/forum" ? "active" : ""
                    }`}
                  >
                    <h6 className="nav-link-text">Event</h6>
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Row justify="start" align="middle">
              <Col>
                <Row justify="end" style={{ fontWeight: "bold" }}>
                  {user && user.user.name}
                </Row>
                <Row justify="end">
                  {user && user.user.role.toLowerCase() === "orang_tua"
                    ? "Orang tua"
                    : user && user.user.role.toLowerCase()}
                </Row>
              </Col>
              <Col>
                <Row justify="end" style={{ marginLeft: "10px" }}>
                  <Avatar icon={<UserOutlined />} />
                </Row>
              </Col>
            </Row>
            <Col span={1}>
              {/* <img
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/");
                  localStorage.removeItem("login_data");
                }}
                src={ic_logout}
                width={32}
                height={32}
                alt=""
              /> */}
              {/* <svg onClick={() => {
                navigate("/");
                localStorage.removeItem("login_data");
              }} style={{ cursor: "pointer", marginLeft: "10px" }} width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.875 0H4.125C1.7875 0 0 1.82 0 4.2V12.6H11.825L8.6625 9.38C8.1125 8.82 8.1125 7.98 8.6625 7.42C9.2125 6.86 10.0375 6.86 10.5875 7.42L16.0875 13.02C16.6375 13.58 16.6375 14.42 16.0875 14.98L10.5875 20.58C10.0375 21.14 9.2125 21.14 8.6625 20.58C8.1125 20.02 8.1125 19.18 8.6625 18.62L11.825 15.4H0V23.8C0 26.18 1.7875 28 4.125 28H17.875C20.2125 28 22 26.18 22 23.8V4.2C22 1.82 20.2125 0 17.875 0Z" fill="white" />
              </svg> */}
              <button
                class="Btn"
                onClick={() => {
                  navigate("/");
                  localStorage.removeItem("login_data");
                }}
                style={{ marginLeft: "20px" }}
              >
                <div class="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>
                <div class="text">Logout</div>
              </button>
            </Col>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  if (admin) {
    <Navbar
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFB4B4", // Replace with your custom color
        color: "#ffffff", // Replace with your custom text color
        height: "80px",
        paddingTop: "20px",
      }}
      expand="lg"
    >
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={Logo}
            alt="Image"
            style={{
              width: "180px",
              height: "auto",
              marginBottom: "10px",
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-start"
          style={{ backgroundColor: "#FFB4B4" }}
        >
          {desa && (
            <Nav className="mx-auto align-items-center">
              <Nav.Link
                href="/dashboard"
                className={`nav-link ${
                  activeLink === "/dashboard" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Home</h6>
              </Nav.Link>
              <Nav.Link
                href="/artikel"
                className={`nav-link ${activeLink === "/" ? "active" : ""}`}
              >
                <h6 className="nav-link-text">Input Data</h6>
              </Nav.Link>
              <Nav.Link
                href="/forum"
                className={`nav-link ${
                  activeLink === "/forum" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Desa</h6>
              </Nav.Link>
            </Nav>
          )}
          {posyandu && (
            <Nav className="mx-auto align-items-center">
              <Nav.Link
                href="/dashboard"
                className={`nav-link ${
                  activeLink === "/dashboard" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Home</h6>
              </Nav.Link>
              <Nav.Link
                href="/artikel"
                className={`nav-link ${activeLink === "/" ? "active" : ""}`}
              >
                <h6 className="nav-link-text">Input Data</h6>
              </Nav.Link>
              <Nav.Link
                href="/forum"
                className={`nav-link ${
                  activeLink === "/forum" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Posyandu</h6>
              </Nav.Link>
            </Nav>
          )}
          {kader && (
            <Nav className="mx-auto align-items-center">
              <Nav.Link
                href="/dashboard"
                className={`nav-link ${
                  activeLink === "/dashboard" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Home</h6>
              </Nav.Link>
              <Nav.Link
                href="/artikel"
                className={`nav-link ${activeLink === "/" ? "active" : ""}`}
              >
                <h6 className="nav-link-text">Register Akun</h6>
              </Nav.Link>
              <Nav.Link
                href="/forum"
                className={`nav-link ${
                  activeLink === "/forum" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Kader Posyandu</h6>
              </Nav.Link>
            </Nav>
          )}
          {tenkes && (
            <Nav className="mx-auto align-items-center">
              <Nav.Link
                href="/tenaga-kesehatan/dashboard"
                className={`nav-link ${
                  activeLink === "/dashboard" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Home</h6>
              </Nav.Link>
              <Nav.Link
                href="/artikel"
                className={`nav-link ${activeLink === "/" ? "active" : ""}`}
              >
                <h6 className="nav-link-text">Register Akun</h6>
              </Nav.Link>
              <Nav.Link
                href="/forum"
                className={`nav-link ${
                  activeLink === "/forum" ? "active" : ""
                }`}
              >
                <h6 className="nav-link-text">Tenaga Kesehatan</h6>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>;
  }
  return (
    // <Row className="container" justify="center" align="middle" style={{ backgroundColor: "#f5f5f5" }}>
    //     <Col span={10}>
    //       <Link to="/">
    //         <div className="title-header">
    //           Gizi<span style={{ color: "#1890ff" }}>Balita</span>
    //         </div>
    //       </Link>
    //     </Col>
    //     <Col span={2}>
    //       <Link to="/#">Home</Link>
    //     </Col>
    //     <Col span={2}>
    //       <Link to="/#">About </Link>
    //     </Col>
    //     <Col span={2}>

    //     </Col>
    //     <Col span={2}>
    //       <Link to="/sign-up">
    //         <button
    //           type="button"
    //           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    //         >
    //           Sign Up
    //         </button>
    //       </Link>
    //     </Col>
    //   </Row>

    <BasicExample />
  );
}
