import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';
import PropTypes from 'prop-types';
import '../styles/EditProduct.css';

export default function EditProduct({ product, fetchData }) {
  const notyf = new Notyf();
  const [show, setShow] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(product.image || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`http://localhost:4000/products/${product._id}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
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
      if (data.success) {
        notyf.success("Product updated successfully");
        fetchData();
        handleClose();
      } else {
        notyf.error(data.message || "Failed to update product");
      }
    })
    .catch(err => {
      console.error("Update error:", err);
      notyf.error("Error updating product");
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <Button 
        variant="outline-primary"
        size="sm"
        onClick={handleShow}
        className="edit-product-btn"
      >
        Update
      </Button>

      <Modal show={show} onHide={handleClose} className="edit-product-modal">
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="form-group-tech-modal mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control-tech-modal"
              />
            </Form.Group>
            <Form.Group className="form-group-tech-modal mb-3">
              <Form.Label className="form-label-tech-modal">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-control-tech-modal"
              />
            </Form.Group>
            <Form.Group className="form-group-tech-modal mb-3">
              <Form.Label className="form-label-tech-modal">Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="form-control-tech-modal"
              />
            </Form.Group>
            <Form.Group className="form-group-tech-modal mb-3">
              <Form.Label className="form-label-tech-modal">Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control-tech-modal"
              />
              {image && (
                <div className="mt-2 text-center">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="image-preview-modal"
                  />
                </div>
              )}
            </Form.Group>
            <div className="modal-footer-buttons d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="loading-spinner-modal" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

EditProduct.propTypes = {
  product: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired
};