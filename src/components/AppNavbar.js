import { useState, useContext, useRef, useEffect } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import '../styles/AppNavbar.css';
import logo from '../assets/logo/logo.png';

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();


  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Navbar expand="lg" sticky="top" className="navbar-light-navy m-2 rounded-pill p-0" >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          <img src={logo} alt="Red Ram Logo" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/" exact="true" className="nav-fade-on-reload mx-2">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products" exact="true" className="nav-fade-on-reload mx-2">Products</Nav.Link>
            {(user.id !== null) && (
              <>
                {user.isAdmin && (
                  <Nav.Link as={NavLink} to="/addProduct" exact="true" className="nav-fade-on-reload mx-2">Add Product</Nav.Link>
                )}
                {!user.isAdmin && (
                  <>
                    <Nav.Link as={NavLink} to="/cart" exact="true" className="nav-fade-on-reload mx-2">Cart</Nav.Link>
                    <Nav.Link as={NavLink} to="/myOrders" exact="true" className="nav-fade-on-reload mx-2">My Orders</Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>

          <Nav>
            <div className="dropdown-animation-wrapper" ref={dropdownRef}>
              <Nav.Link
                as="a"
                onClick={() => setDropdownOpen(prev => !prev)}
                className="nav-link nav-fade-on-reload custom-account-link"
              >
                Account
              </Nav.Link>
              <div className={`animated-dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                {user.id !== null ? (
                  <>
                    <Nav.Link as={NavLink} to="/profile" exact="true" className="dropdown-item">Profile</Nav.Link>
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
