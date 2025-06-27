import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';
import '../styles/Login.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

export default function Login() {

    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    function authenticate(authenticateParameter) {

        authenticateParameter.preventDefault();
        fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            } )
        })
        .then(res => res.json())
        .then(data => {

            if(data.access !== undefined){

                console.log(data.access);

                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');

                notyf.success('Login Successful ');

            } else if (data.message === "Email and password do not match") {

                notyf.error('Incorrect email and/or password. Try Again');

            } else {

                notyf.error('User Not Found. Try Again.');

            }

        })

    }

    function retrieveUserDetails(token){
            
        fetch('http://localhost:4000/users/details', {
            headers: {
                Authorization: `Bearer ${ token }`
            }
        } )
        .then(res => res.json())
        .then(data => {

            console.log(data);
                setUser({
                id: data._id,
                isAdmin: data.isAdmin
            });

        })

    };

    useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (
        (user.id !== null) ?
            <Navigate to="/products" />
            :
            <div className="login-container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <Form onSubmit={(authenticateParameter) => authenticate(authenticateParameter)} className="login-form">
                            <h1 className="login-title">Login</h1>
                            <Form.Group className="form-group-tech">
                                <Form.Label className="form-label-login">
                                    <FontAwesomeIcon icon={faEnvelope} className="me-2" /> {/* Email icon */}
                                    Email address
                                </Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email" 
                                    required
                                    value={email}
                                    onChange={(authenticateParameter) => setEmail(authenticateParameter.target.value)}
                                    className="form-control-login"
                                />
                            </Form.Group>

                            <Form.Group className="form-group-tech mb-3">
                                <Form.Label className="form-label-login">
                                    <FontAwesomeIcon icon={faLock} className="me-2" /> {/* Password icon */}
                                    Password
                                </Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    required
                                    value={password}
                                    onChange={(authenticateParameter) => setPassword(authenticateParameter.target.value)}
                                    className="form-control-login"
                                />
                            </Form.Group>

                            { isActive ? 
                                <Button variant="primary" type="submit" id="loginBtn" className="submit-btn-tech">
                                    Login
                                </Button>
                                : 
                                <Button variant="danger" type="submit" id="loginBtn" disabled className="submit-btn-tech">
                                    Login
                                </Button>
                            }
                        </Form>       
                    </div>
                </div>
            </div>
    )
}
