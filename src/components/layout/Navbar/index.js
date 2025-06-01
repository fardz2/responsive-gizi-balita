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
    justifyContent: "space-between",
    backgroundColor: "#FFB4B4",
    color: "#ffffff",
    height: "80px",
    paddingTop: "20px",
    zIndex: 1000, // Added z-index
  };

  return (
    <Navbar style={navbarStyle} expand="md">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={Logo}
            alt="GiziBalita Logo"
            className=" max-w-[120px] h-auto mb-[10px] transition-all duration-300  xs:max-w-[100px]"
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
  const { isLogin, admin, posyandu, desa, kader, tenkes } = props;
  let navigate = useNavigate();
  const [user, setUser] = useState(login_data);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveLink(currentPath);
  }, []);

  if (isLogin) {
    return (
      <Navbar
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFB4B4",
          color: "#ffffff",
          height: "80px",
          paddingTop: "20px",
          zIndex: 1000, // Added z-index
        }}
        expand="lg"
      >
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={Logo}
              alt="GiziBalita Logo"
              className=" max-w-[120px] h-auto mb-[10px] transition-all duration-300  xs:max-w-[100px]"
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
                    <h6 className="nav-link-text">Forum</h6>
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
                    <h6 className="nav-link-text">Forum</h6>
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

            <Row justify="center" align="middle">
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
            <Row justify="center" align="middle">
              <Col style={{ display: "flex", alignItems: "center" }}>
                <button
                  className="Btn"
                  onClick={() => {
                    navigate("/");
                    localStorage.removeItem("login_data");
                  }}
                  style={{ marginLeft: "20px" }}
                >
                  <div className="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>
                  <div className="text">Logout</div>
                </button>
              </Col>
            </Row>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  if (admin) {
    return (
      <Navbar
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFB4B4",
          color: "#ffffff",
          height: "80px",
          paddingTop: "20px",
          zIndex: 1000, // Added z-index
        }}
        expand="lg"
      >
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={Logo}
              alt="GiziBalita Logo"
              className=" max-w-[120px] h-auto mb-[10px] transition-all duration-300  xs:max-w-[100px]"
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
      </Navbar>
    );
  }

  return <BasicExample />;
}
