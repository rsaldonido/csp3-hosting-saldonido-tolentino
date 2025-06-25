import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function AddProduct() {
  const notyf = new Notyf();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function createProduct(e) {
    e.preventDefault();
    setIsLoading(true);

    let token = localStorage.getItem('token');

    fetch('http://localhost:4000/products', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        image: image
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        notyf.success("Product Added Successfully");
        navigate('/products');
      } else if (data.error) {
        notyf.error(data.error);
      } else {
        notyf.error("Failed to Add Product");
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      notyf.error("Network error occurred");
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  return (
    (user.isAdmin === true)
    ?
    <>
      <h1 className="my-5 text-center">Add Product</h1>
      <Form onSubmit={createProduct}>
        <Form.Group className="mb-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Description"
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            placeholder="Enter Price"
            required
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Product Image:</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <div className="mt-2">
              <img 
                src={image} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
              />
            </div>
          )}
        </Form.Group>
        
        <Button variant="primary" type="submit" className="my-3" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Submit'}
        </Button>
      </Form>
    </>
    :
    <Navigate to="/products" />
  );
}