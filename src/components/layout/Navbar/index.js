import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Col, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavbarComp(props) {
  const { isLogin, admin, posyandu, desa, kader, tenkes } = props;
  const navigate = useNavigate();
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(localStorage.getItem("login_data") || "{}");
  }
  const [user, setUser] = useState(login_data);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveLink(currentPath);
  }, []);

  const navbarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFB4B4",
    color: "#ffffff",
    height: "80px",
    paddingTop: "20px",
    zIndex: 1000,
  };

  const navLinkStyle = {
    color: "white",
    margin: "0 10px",
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    fontWeight: "bold",
    textDecoration: "underline",
  };

  // Basic Navbar for non-authenticated users
  const BasicNavbar = () => (
    <Navbar style={navbarStyle} expand="md">
      <Container fluid="md">
        <Navbar.Brand as={Link} to="/home">
          <h2 className="text-xs md:text-xl">KMS Digital Lebakwangi</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
          style={{ backgroundColor: "#FFB4B4" }}
        >
          <Nav className="ms-auto align-items-center">
            <Link
              to="/dashboard"
              style={
                activeLink === "/dashboard" ? activeNavLinkStyle : navLinkStyle
              }
            >
              <h5>Home</h5>
            </Link>
            <Link
              to="/"
              style={activeLink === "/" ? activeNavLinkStyle : navLinkStyle}
            >
              <h5>About</h5>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  if (isLogin) {
    return (
      <Navbar style={navbarStyle} expand="lg">
        <Container fluid="md">
          <Navbar.Brand as={Link} to="/home">
            <h2 className="text-xs md:text-xl">KMS Digital Lebakwangi</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-start"
            style={{ backgroundColor: "#FFB4B4" }}
          >
            <Nav className="mx-auto align-items-center">
              {user?.user?.role === "ORANG_TUA" && (
                <>
                  <Link
                    to="/dashboard"
                    style={
                      activeLink === "/dashboard"
                        ? activeNavLinkStyle
                        : navLinkStyle
                    }
                  >
                    <h6 className="nav-link-text">Home</h6>
                  </Link>
                  <Link
                    to="/artikel"
                    style={
                      activeLink === "/artikel"
                        ? activeNavLinkStyle
                        : navLinkStyle
                    }
                  >
                    <h6 className="nav-link-text">Artikel</h6>
                  </Link>
                  <Link
                    to="/forum"
                    style={
                      activeLink === "/forum"
                        ? activeNavLinkStyle
                        : navLinkStyle
                    }
                  >
                    <h6 className="nav-link-text">Forum</h6>
                  </Link>
                </>
              )}
              {user?.user?.role === "TENAGA_KESEHATAN" && (
                <>
                  <Link
                    to="/tenaga-kesehatan/dashboard"
                    style={
                      activeLink === "/tenaga-kesehatan/dashboard"
                        ? activeNavLinkStyle
                        : navLinkStyle
                    }
                  >
                    <h6 className="nav-link-text">Home</h6>
                  </Link>
                </>
              )}
              {user?.user?.role === "DESA" && (
                <>
                  <Link
                    to="/desa/dashboard"
                    style={
                      activeLink === "/desa/dashboard"
                        ? activeNavLinkStyle
                        : navLinkStyle
                    }
                  >
                    <h6 className="nav-link-text">Home</h6>
                  </Link>
                  <Link
                    to="/desa/reminder"
                    style={
                      activeLink === "/desa/reminder"
                        ? activeNavLinkStyle
                        : navLinkStyle
                    }
                  >
                    <h6 className="nav-link-text">Event</h6>
                  </Link>
                </>
              )}
            </Nav>

            <Row justify="center" align="middle">
              <Col>
                <Row justify="end" style={{ fontWeight: "bold" }}>
                  {user?.user?.name || "User"}
                </Row>
                <Row justify="end">
                  {user?.user?.role
                    ? user.user.role.toLowerCase() === "orang_tua"
                      ? "Orang Tua"
                      : user.user.role
                    : "Guest"}
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
                    localStorage.removeItem("login_data");
                    navigate("/");
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
      <Navbar style={navbarStyle} expand="lg">
        <Container fluid="md">
          <Navbar.Brand as={Link} to="/home">
            <h2 className="text-xs md:text-xl">KMS Digital Lebakwangi</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-start"
            style={{ backgroundColor: "#FFB4B4" }}
          >
            {desa && (
              <Nav className="mx-auto align-items-center">
                <Link
                  to="/dashboard"
                  style={
                    activeLink === "/dashboard"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Home</h6>
                </Link>
                <Link
                  to="/artikel"
                  style={
                    activeLink === "/artikel"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Input Data</h6>
                </Link>
                <Link
                  to="/forum"
                  style={
                    activeLink === "/forum" ? activeNavLinkStyle : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Desa</h6>
                </Link>
              </Nav>
            )}
            {posyandu && (
              <Nav className="mx-auto align-items-center">
                <Link
                  to="/dashboard"
                  style={
                    activeLink === "/dashboard"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Home</h6>
                </Link>
                <Link
                  to="/artikel"
                  style={
                    activeLink === "/artikel"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Input Data</h6>
                </Link>
                <Link
                  to="/forum"
                  style={
                    activeLink === "/forum" ? activeNavLinkStyle : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Posyandu</h6>
                </Link>
              </Nav>
            )}
            {kader && (
              <Nav className="mx-auto align-items-center">
                <Link
                  to="/dashboard"
                  style={
                    activeLink === "/dashboard"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Home</h6>
                </Link>
                <Link
                  to="/artikel"
                  style={
                    activeLink === "/artikel"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Register Akun</h6>
                </Link>
                <Link
                  to="/forum"
                  style={
                    activeLink === "/forum" ? activeNavLinkStyle : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Kader Posyandu</h6>
                </Link>
              </Nav>
            )}
            {tenkes && (
              <Nav className="mx-auto align-items-center">
                <Link
                  to="/tenaga-kesehatan/dashboard"
                  style={
                    activeLink === "/tenaga-kesehatan/dashboard"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Home</h6>
                </Link>
                <Link
                  to="/artikel"
                  style={
                    activeLink === "/artikel"
                      ? activeNavLinkStyle
                      : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Register Akun</h6>
                </Link>
                <Link
                  to="/forum"
                  style={
                    activeLink === "/forum" ? activeNavLinkStyle : navLinkStyle
                  }
                >
                  <h6 className="nav-link-text">Tenaga Kesehatan</h6>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  return <BasicNavbar />;
}
