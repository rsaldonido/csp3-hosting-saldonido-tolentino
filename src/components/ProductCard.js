import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({productProp}) {
  const { _id, name, description, price, image } = productProp;

  return (
    <Card className="h-100">
      {image && (
        <Card.Img 
          variant="top" 
          src={image} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle>Description:</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Card.Subtitle>Price:</Card.Subtitle>
        <Card.Text>&#8369; {price}</Card.Text>
        <Link 
          className="btn btn-primary mt-auto" 
          to={`/products/${_id}`}
        >
          Details
        </Link>
      </Card.Body>
    </Card>
  );
}

ProductCard.propTypes = {
  productProp: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string
  })
};