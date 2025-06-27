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
	const {user} = useContext(UserContext);
	const [firstName,setFirstName] = useState("");
	const [lastName,setLastName] = useState("");
	const [email,setEmail] = useState("");
	const [mobileNo,setMobileNo] = useState(0);
	const [password,setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isRegisterComplete, setIsRegisterComplete] = useState(false);


	useEffect(()=>{

		if (
			firstName !== "" &&
			lastName !== "" &&
			email !== "" &&
			mobileNo !== "" &&
			password !== "" &&
			confirmPassword !== "" &&
			password === confirmPassword &&
			mobileNo.length === 11
		){

			setIsActive(true)

		} else {

			setIsActive(false)

		}

	},[firstName,lastName,email,mobileNo,password,confirmPassword])

	function registerUser(e) {

		e.preventDefault();

		fetch('https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/users/register',{

		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({

			firstName: firstName,
			lastName: lastName,
			email: email,
			mobileNo: mobileNo,
			password: password

		} )
		})
		.then(res => res.json())
		.then(data => {

		//data is the response of the api/server after it's been process as JS object through our res.json() method.
		console.log(data);
		if (data.message === "Registered Successfully") {
		    setFirstName('');
		    setLastName('');
		    setEmail('');
		    setMobileNo('');
		    setPassword('');
		    setConfirmPassword('');
		    notyf.success("Registration successful");
		    setIsRegisterComplete(true);
		}

		})
	}

	if(isRegisterComplete) {
		return <Navigate to="/login" />;
	}

    return (


    	(user.id !== null) ?
    		<Navigate to="/login" />
    		:
    		<div className="register-container">
    		    <div className="row justify-content-center">
    		        <div className="col-lg-6 col-md-8">
    		            <Form onSubmit={(e) => registerUser(e)} className="register-form">
    		                <h1 className="register-title">Register</h1>
    		                <Form.Group className="form-group-register">
    		                    <Form.Label className="form-label-register">
                                    <FontAwesomeIcon icon={faUser} className="me-2" />
                                    First Name:
                                </Form.Label>
    		                    <Form.Control 
    		                        type="text" 
    		                        placeholder="Enter First Name" 
    		                        required 
    		                        value={firstName}
    		                        onChange={e => {setFirstName(e.target.value)}}
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
    		                        placeholder="Enter Last Name" 
    		                        required
    		                        value={lastName}
    		                        onChange={e => {setLastName(e.target.value)}}
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
    		                        placeholder="Enter Email" 
    		                        required
    		                        value={email}
    		                        onChange={e => {setEmail(e.target.value)}}
    		                        className="form-control-register"
    		                    />
    		                </Form.Group>
    		                <Form.Group className="form-group-register"> 
    		                    <Form.Label className="form-label-register">
                                    <FontAwesomeIcon icon={faMobileAlt} className="me-2" />
                                    Mobile No:
                                </Form.Label>
    		                    <Form.Control 
    		                        type="number" 
    		                        placeholder="Enter 11 Digit No." 
    		                        required  
    		                        value={mobileNo}
    		                        onChange={e => {setMobileNo(e.target.value)}}
    		                        className="form-control-register"
    		                    />
    		                </Form.Group>
    		                <Form.Group className="form-group-register">
    		                    <Form.Label className="form-label-register">
                                    <FontAwesomeIcon icon={faLock} className="me-2" />
                                    Password:
                                </Form.Label>
    		                    <Form.Control 
    		                        type="password" 
    		                        placeholder="Enter Password" 
    		                        required 
    		                        value={password}
    		                        onChange={e => {setPassword(e.target.value)}}
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
    		                        placeholder="Confirm Password" 
    		                        required 
    		                        value={confirmPassword}
    		                        onChange={e => {setConfirmPassword(e.target.value)}}
    		                        className="form-control-register"
    		                    />
    		                </Form.Group>
    		                {/* conditionally render submit button based on isActive state */}
    		                { isActive ? 
    		                    <Button variant="primary" type="submit" id="submitBtn" className="submit-btn-tech"> 
    		                        Submit
    		                    </Button>
    		                    : 
    		                    <Button variant="danger" type="submit" id="submitBtn" disabled className="submit-btn-tech"> 
    		                        Submit
    		                    </Button>
    		                }
    		            </Form>
    		        </div>
    		    </div>
    		</div>
   )

}
