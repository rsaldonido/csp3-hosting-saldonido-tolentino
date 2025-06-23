import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

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

			})
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
        })
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
	        <Form onSubmit={(authenticateParameter) => authenticate(authenticateParameter)}>
	        	<h1 className="my-5 text-center">Login</h1>
	            <Form.Group>
	                <Form.Label>Email address</Form.Label>
	                <Form.Control 
	                    type="email" 
	                    placeholder="Enter email" 
	                    required
	                    value={email}
	        			onChange={(authenticateParameter) => setEmail(authenticateParameter.target.value)}
	                />
	            </Form.Group>

	            <Form.Group className="mb-3">
	                <Form.Label>Password</Form.Label>
	                <Form.Control 
	                    type="password" 
	                    placeholder="Password" 
	                    required
	                    value={password}
	        			onChange={(authenticateParameter) => setPassword(authenticateParameter.target.value)}
	                />
	            </Form.Group>

	            { isActive ? 
	                <Button variant="primary" type="submit" id="loginBtn">
	                    Login
	                </Button>
	                : 
	                <Button variant="danger" type="submit" id="loginBtn" disabled>
	                    Login
	                </Button>
	            }
        	</Form>       
    )
}