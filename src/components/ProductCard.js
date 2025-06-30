import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

export default function ProductCard({productProp}) {
  const { _id, name, description, price, image } = productProp;

  return (
    <Card className="product-card h-100">
      {image ? (
        <Card.Img 
          variant="top" 
          src={image} 
          className="product-card-img"
        />
      ) : (
        <div className="product-card-no-image">
          No Image Available
        </div>
      )}
      <Card.Body className="product-card-body d-flex flex-column">
        <Card.Title className="product-card-title">{name}</Card.Title>
        {/*<Card.Subtitle className="product-card-subtitle">Description:</Card.Subtitle>*/}
        {/*<Card.Text className="product-card-text">{description}</Card.Text>*/}
        <Card.Subtitle className="product-card-subtitle">Price:</Card.Subtitle>
        <Card.Text className="product-card-price">&#8369; {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Card.Text>
        <Link 
          className="product-details-btn mt-auto" 
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