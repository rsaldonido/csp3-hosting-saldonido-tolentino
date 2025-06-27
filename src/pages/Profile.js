import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';
import UpdateProfile from '../components/UpdateProfile';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import '../styles/Profile.css';

export default function Profile() {
	const notyf = new Notyf();
	const { user } = useContext(UserContext);
	const [details, setDetails] = useState(null); // was {}
	const [loading, setLoading] = useState(true);

	const fetchUserDetails = () => {
	    setLoading(true);

	    fetch(`http://localhost:4000/users/details`, {
	        headers: {
	            Authorization: `Bearer ${localStorage.getItem('token')}`
	        }
	    })
	    .then(res => res.json())
	    .then(data => {
	        if (data && !data.error) {
	            setDetails(data);
	        } else if (data.error === "User not found") {
	            notyf.error("User Not Found");
	        } else {
	            notyf.error("Something Went Wrong. Contact Your System Admin.");
	        }
	    })
	    .catch((err) => {
	        console.error(err);
	        notyf.error("Network Error");
	    })
	    .finally(() => {
	        setLoading(false);
	    });
	};


	useEffect(() => {
		fetchUserDetails();
	}, []);

	if (user.id === null) {
		return <Navigate to="/products" />;
	}

	if (user.id === null) {
	    return <Navigate to="/products" />;
	}

	if (loading || !details) {
	    return (
	        <Container className="mt-5 text-center">
	            <h4 className="loading-profile-message">Loading profile...</h4>
	        </Container>
	    );
	}


	return (


		<div className="profile-container">
			<Container className="profile-header-card mt-5">
				<h1 className="profile-title mb-5 ">Profile</h1>
				<h2 className="profile-name mt-3">{`${details.firstName} ${details.lastName}`}</h2>
				<hr className="profile-hr"/>
				<h4 className="contacts-title">Contacts</h4>
				<ul className="contact-list">
					<li>Email: {details.email}</li>
					<li>Mobile No: {details.mobileNo}</li>
				</ul>
			</Container>

			<Container className="profile-forms-container pb-5">
				<Row>
					<Col md={6}>
						<ResetPassword />
					</Col>
					<Col md={6}>
						<UpdateProfile 
						    key={details.updatedAt || details.firstName || Date.now()} // Add a dynamic key
						    userDetails={details}
						    fetchUserDetails={fetchUserDetails}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
