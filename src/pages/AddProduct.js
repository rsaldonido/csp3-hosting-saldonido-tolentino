import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import '../styles/AddProduct.css';

export default function AddProduct() {
  const notyf = new Notyf();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleImageChange(ImageChangeParameter) {
    const file = ImageChangeParameter.target.files[0];
    if (file) {
      const maxSize = 50 * 1024;
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!validTypes.includes(file.type)) {
        notyf.error("Only JPG, JPEG, and PNG formats are allowed.");
        return;
      }

      if (file.size > maxSize) {
        notyf.error("Image must be less than 50KB.");
        return;
      }

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

    fetch('https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/products', {
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
    .then(response => response.json())
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
      // console.error('Fetch error:', error);
      notyf.error("Failed to Meet Image Requirements");
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  return (
    (user.isAdmin === true)
    ?
    <div className="add-product-container">
      <h1 className="add-product-title">Add Product</h1>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <Form onSubmit={createProduct} className="add-product-form">
              <Form.Group className="form-group-tech">
                <Form.Label className="form-label-tech">Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  required
                  value={name}
                  onChange={changeEvent => setName(changeEvent.target.value)}
                  className="form-control-tech"
                />
              </Form.Group>
              
              <Form.Group className="form-group-tech">
                <Form.Label className="form-label-tech">Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Description"
                  required
                  value={description}
                  onChange={changeEvent => setDescription(changeEvent.target.value)}
                  className="form-control-tech textarea-tech"
                />
              </Form.Group>
              
              <Form.Group className="form-group-tech">
                <Form.Label className="form-label-tech">Price:</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Enter Price"
                  required
                  value={price}
                  onChange={changeEvent => setPrice(changeEvent.target.value)}
                  className="form-control-tech"
                />
              </Form.Group>
              
              <Form.Group className="form-group-tech">
                <Form.Label className="form-label-tech">Product Image</Form.Label>
                <Form.Label className="form-label-tech">Only Accepts .JPG, .JPEG, .PNG with less than 50KB</Form.Label>
                <div className={`file-input-container ${image ? 'has-file' : ''}`}>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input-tech"
                  />
                  <div className="file-input-label">
                    {image ? 'Image Selected ✓' : 'Click to select an image or drag and drop'}
                  </div>
                </div>
                {image && (
                  <div className="image-preview-container">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="image-preview"
                    />
                  </div>
                )}
              </Form.Group>
              
              <div className="text-center">
                <Button variant="primary" type="submit" className="submit-btn-tech" disabled={isLoading}>
                  {isLoading ? (
                    <span className="loading-text">Creating...</span>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
    :
    <Navigate to="/products" />
  );
}