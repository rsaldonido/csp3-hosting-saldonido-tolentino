// AppNavbar.js (Fully Fixed and Working)
import { useState, useContext, useRef, useEffect } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import '../styles/AppNavbar.css';
import logo from '../assets/logo/logo.png';

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  const [accountOpen, setAccountOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const location = useLocation();
  const hamburgerRef = useRef();
  const mobileAccountRef = useRef();
  const desktopAccountRef = useRef();

  useEffect(() => {
    setAccountOpen(false);
    setHamburgerOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutsideMobileAccount =
        mobileAccountRef.current && !mobileAccountRef.current.contains(e.target);
      const clickedOutsideDesktopAccount =
        desktopAccountRef.current && !desktopAccountRef.current.contains(e.target);
      const clickedOutsideHamburger =
        hamburgerRef.current && !hamburgerRef.current.contains(e.target);

      if (clickedOutsideMobileAccount && clickedOutsideDesktopAccount && clickedOutsideHamburger) {
        setAccountOpen(false);
        setHamburgerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <Navbar expand="lg" fixed="top" className="navbar-light-navy m-2 rounded-pill p-0">

      <Container fluid className="position-relative">
        <Navbar.Brand as={Link} to="/" className="me-auto">
          <img src={logo} alt="Red Ram Logo" className="navbar-logo" />
        </Navbar.Brand>

        <div className="d-flex align-items-center d-lg-none mobile-icons nav-fade-on-reload">
          <div className="account-wrapper me-3" ref={mobileAccountRef}>
            <button
              className="nav-icon-button"
              onClick={() => {
                setAccountOpen(!accountOpen);
                setHamburgerOpen(false);
              }}
            >
              Account
            </button>
            <div className={`mobile-dropdown-menu ${accountOpen ? 'show' : ''}`}>
              {user.id !== null ? (
                <>
                  <Nav.Link as={NavLink} to="/profile" className="dropdown-item">Profile</Nav.Link>
                  <Nav.Link as={NavLink} to="/logout" className="dropdown-item">Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login" className="dropdown-item">Login</Nav.Link>
                  <Nav.Link as={NavLink} to="/register" className="dropdown-item">Register</Nav.Link>
                </>
              )}
            </div>
          </div>

          <div className="hamburger-wrapper" ref={hamburgerRef}>
            <button
              className={`hamburger-icon ${hamburgerOpen ? 'open' : ''}`}
              onClick={() => {
                setHamburgerOpen(!hamburgerOpen);
                setAccountOpen(false);
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`hamburger-menu ${hamburgerOpen ? 'show' : ''}`}>
              <Nav className="flex-column">
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
                {user.id !== null && user.isAdmin && (
                  <Nav.Link as={NavLink} to="/addProduct">Add Product</Nav.Link>
                )}
                {user.id !== null && !user.isAdmin && (
                  <>
                    <Nav.Link as={NavLink} to="/cart">Cart</Nav.Link>
                    <Nav.Link as={NavLink} to="/myOrders">My Orders</Nav.Link>
                  </>
                )}
              </Nav>
            </div>
          </div>
        </div>

        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/" exact="true" className="nav-fade-on-reload mx-2">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products" exact="true" className="nav-fade-on-reload mx-2">Products</Nav.Link>
            {user.id !== null && user.isAdmin && (
              <Nav.Link as={NavLink} to="/addProduct" className="nav-fade-on-reload mx-2">Add Product</Nav.Link>
            )}
            {user.id !== null && !user.isAdmin && (
              <>
                <Nav.Link as={NavLink} to="/cart" className="nav-fade-on-reload mx-2">Cart</Nav.Link>
                <Nav.Link as={NavLink} to="/myOrders" className="nav-fade-on-reload mx-2">My Orders</Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            <div className="dropdown-animation-wrapper" ref={desktopAccountRef}>
              <Nav.Link
                onClick={() => {
                  setAccountOpen(!accountOpen);
                  setHamburgerOpen(false);
                }}
                className="nav-link nav-fade-on-reload custom-account-link"
              >
                Account
              </Nav.Link>
              <div className={`animated-dropdown-menu ${accountOpen ? 'show' : ''}`}>
                {user.id !== null ? (
                  <>
                    <Nav.Link as={NavLink} to="/profile" className="dropdown-item">Profile</Nav.Link>
                    <Nav.Link as={NavLink} to="/logout" className="dropdown-item">Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={NavLink} to="/login" className="dropdown-item">Login</Nav.Link>
                    <Nav.Link as={NavLink} to="/register" className="dropdown-item">Register</Nav.Link>
                  </>
                )}
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
