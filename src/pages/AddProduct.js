import { useState, useEffect, useContext } from 'react';
import { Form,Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

export default function AddProduct(){

	const notyf = new Notyf();

	const navigate = useNavigate();

    const {user} = useContext(UserContext);


	const [name,setName] = useState("");
	const [description,setDescription] = useState("");
	const [price,setPrice] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	function createProduct(createProductParameter){

		createProductParameter.preventDefault();

		let token = localStorage.getItem('token');
		console.log(token);

		fetch('http://localhost:4000/products',{

			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({

				name: name,
				description: description,
				price: price

			})
		})
		.then(res => {
			
			
			if (res.status === 201) {
	
				notyf.success("Products Added");
				navigate('/products');
				setName('');
				setDescription('');
				setPrice(0);
		
				return res.json(); 
			} 
			else if (res.status === 409) {
				
				notyf.error("Product Already Exists");
				setName('');
				setDescription('');
				setPrice(0);
		
				return res.json(); 
			}
			else {
				
				notyf.error("Failed to Add Product");
				setName('');
				setDescription('');
				setPrice(0);
				return res.json();
			}
		})
		.then(data => {})
		.catch(error => {
			console.error('Fetch error:', error);
			notyf.error("Network error occurred");
			setName('');
			setDescription('');
			setPrice(0);
		});

	}

	return (

            (user.isAdmin === true)
            ?
            <>
                <h1 className="my-5 text-center">Add Product</h1>
                <Form onSubmit={createProductParameter => createProduct(createProductParameter)}>
                    <Form.Group>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                        	type="text"
                        	placeholder="Enter Name"
                        	required
                        	value={name}
                        	onChange={createProductParameter => {setName(createProductParameter.target.value)}}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                        	type="text"
                        	placeholder="Enter Description"
                        	required
                        	value={description}
                        	onChange={createProductParameter => {setDescription(createProductParameter.target.value)}}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                        	type="number"
                        	placeholder="Enter Price"
                        	required
                        	value={price}
                        	onChange={createProductParameter => {setPrice(createProductParameter.target.value)}}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="my-5" disabled={isLoading}>
                    	{isLoading ? 'Creating...' : 'Submit'}
                    </Button>
                </Form>
		    </>
            :
            <Navigate to="/products" />

	)


}