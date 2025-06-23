import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function UpdateProfile({ userDetails, fetchUserDetails }) {
    const notyf = new Notyf();
    
    const [formData, setFormData] = useState({
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        mobileNo: userDetails.mobileNo || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch('http://localhost:4000/users/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
        	if (data.message?.includes('updated')) {
        	  notyf.success(data.message);
        	  fetchUserDetails();
        	} else {
        	  notyf.error(data.message || "Failed to update profile");
        	}
        })
        .catch(err => {
            notyf.error("An error occurred while updating profile");
            console.error(err);
        });
    };

    return (
        <Form onSubmit={handleSubmit} className="mt-4">
            <h4>Update Profile</h4>
            <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control 
                    type="text" 
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            
            <Button variant="primary" type="submit">Update Profile</Button>
        </Form>
    );
}
