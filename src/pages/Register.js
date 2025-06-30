import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import '../styles/Register.css';

// Import Font Awesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

export default function Register() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: ""
  });
  const [isActive, setIsActive] = useState(false);
  const [isRegisterComplete, setIsRegisterComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const { firstName, lastName, email, mobileNo, password, confirmPassword } = formData;
    
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const mobileValid = /^\d{11}$/.test(mobileNo);
    const passwordValid = password.length >= 8;
    const passwordsMatch = password === confirmPassword;
    
    setIsActive(
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      mobileNo.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      emailValid &&
      mobileValid &&
      passwordValid &&
      passwordsMatch
    );
  }, [formData]);

  const handleChange = (handleChangeEvent) => {
    const { name, value } = handleChangeEvent.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, mobileNo, password, confirmPassword } = formData;

    if (!firstName.trim()) {
      notyf.error("First name is required");
      return false;
    }

    if (!lastName.trim()) {
      notyf.error("Last name is required");
      return false;
    }

    if (!email.trim()) {
      notyf.error("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notyf.error("Please enter a valid email address");
      return false;
    }

    if (!mobileNo.trim()) {
      notyf.error("Mobile number is required");
      return false;
    }

    if (!/^\d{11}$/.test(mobileNo)) {
      notyf.error("Mobile number must be 11 digits");
      return false;
    }

    if (!password.trim()) {
      notyf.error("Password is required");
      return false;
    }

    if (password.length < 8) {
      notyf.error("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      notyf.error("Passwords do not match");
      return false;
    }

    return true;
  };

  function registerUser(registerUserParamter) {
    registerUserParamter.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    fetch('https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/users/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNo: formData.mobileNo,
        password: formData.password
      })
    })
    .then(response => {
      // Prevent default error logging
      if (!response.ok) {
        return response.json().then(errData => Promise.reject(errData));
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        notyf.success(data.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNo: "",
          password: "",
          confirmPassword: ""
        });
        setIsRegisterComplete(true);
      } else {
        notyf.error(data.message);
      }
    })
    .catch(() => {
      notyf.error("Registration failed. Please try again.");
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  }

  if (isRegisterComplete) {
    return <Navigate to="/login" />;
  }

  if (user.id !== null) {
    return <Navigate to="/" />;
  }

  return (
    <div className="register-container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <Form onSubmit={registerUser} className="register-form">
            <h1 className="register-title">Register</h1>
            
            <Form.Group className="form-group-register">
              <Form.Label className="form-label-register">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                First Name:
              </Form.Label>
              <Form.Control 
                type="text" 
                name="firstName"
                placeholder="Enter First Name" 
                required 
                value={formData.firstName}
                onChange={handleChange}
                className="form-control-register"
              />
            </Form.Group>
            
            <Form.Group className="form-group-register">
              <Form.Label className="form-label-register">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Last Name:
              </Form.Label>
              <Form.Control 
                type="text" 
                name="lastName"
                placeholder="Enter Last Name" 
                required
                value={formData.lastName}
                onChange={handleChange}
                className="form-control-register"
              />
            </Form.Group>
            
            <Form.Group className="form-group-register">
              <Form.Label className="form-label-register">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Email:
              </Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                placeholder="Enter Email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="form-control-register"
              />
            </Form.Group>
            
            <Form.Group className="form-group-register"> 
              <Form.Label className="form-label-register">
                <FontAwesomeIcon icon={faMobileAlt} className="me-2" />
                Mobile No:
              </Form.Label>
              <Form.Control 
                type="tel" 
                name="mobileNo"
                placeholder="Enter 11 Digit No." 
                required  
                value={formData.mobileNo}
                onChange={handleChange}
                className="form-control-register"
                maxLength="11"
              />
            </Form.Group>
            
            <Form.Group className="form-group-register">
              <Form.Label className="form-label-register">
                <FontAwesomeIcon icon={faLock} className="me-2" />
                Password:
              </Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                placeholder="Enter Password (min 8 chars)" 
                required 
                value={formData.password}
                onChange={handleChange}
                className="form-control-register"
              />
            </Form.Group>
            
            <Form.Group className="form-group-register mb-3">
              <Form.Label className="form-label-register"> 
                <FontAwesomeIcon icon={faLock} className="me-2" />
                Confirm Password:
              </Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password" 
                required 
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control-register"
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              id="submitBtn" 
              className="submit-btn-tech"
              disabled={!isActive || isSubmitting}
            > 
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}