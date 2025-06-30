import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import '../styles/UpdateProfile.css';

export default function UpdateProfile({ userDetails, fetchUserDetails }) {
    const notyf = new Notyf();
    
    const [formData, setFormData] = useState({
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        mobileNo: userDetails.mobileNo || ''
    });

    const handleChange = (changeEvent) => {
        setFormData({
            ...formData,
            [changeEvent.target.name]: changeEvent.target.value
        });
    };

    const handleSubmit = (submitEvent) => {
        submitEvent.preventDefault();
        
        fetch('https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/users/update-profile', {
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
            // console.error(err);
        });
    };

    return (
        <Form onSubmit={handleSubmit} className="update-profile-form mt-4">
            <h4 className="update-profile-title">Update Profile</h4>
            <Form.Group className="form-group-tech-profile mb-3">
                <Form.Label className="form-label-tech-profile">First Name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="form-control-tech-profile"
                />
            </Form.Group>
            
            <Form.Group className="form-group-tech-profile mb-3">
                <Form.Label className="form-label-tech-profile">Last Name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="form-control-tech-profile"
                />
            </Form.Group>
            
            <Form.Group className="form-group-tech-profile mb-3">
                <Form.Label className="form-label-tech-profile">Mobile Number</Form.Label>
                <Form.Control 
                    type="text" 
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    required
                    className="form-control-tech-profile"
                />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="submit-btn-tech-profile">Update Profile</Button>
        </Form>
    );
}
