import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/ProductView.css';

export default function ProductView() {
  const notyf = new Notyf();
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (user.isAdmin) {
      navigate('/products');
    }
  }, [user.isAdmin, navigate]);

  const addToCart = (productId) => {
    setIsAddingToCart(true);
    
    fetch("https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/cart/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        subtotal: product.price * quantity
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Admin is forbidden') {
        notyf.error("Admins cannot add items to cart");
      } else if (data.message === "Item added to cart successfully") {
        notyf.success(data.message);
        navigate("/products");
      } else {
        throw new Error(data.message || 'Unknown response from server');
      }
    })
    .catch(err => {
      // console.error("Add to cart error:", err);
      notyf.error(err.message || "Failed to add item to cart");
    })
    .finally(() => {
      setIsAddingToCart(false);
    });
  };

  useEffect(() => {
    if (user.isAdmin) return;
    
    setIsLoading(true);
    setError(null);
    
    fetch(`https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/products/${productId}`)
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        setProduct(data);
      } else {
        throw new Error(data.message || 'Product not found');
      }
    })
    .catch(err => {
      // console.error("Fetch product error:", err);
      setError(err.message);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [productId, user.isAdmin]);

  if (user.isAdmin) {
    return (
      <div className="product-view-container">
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status" className="loading-spinner">
            <span className="visually-hidden">Redirecting...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="product-view-container">
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status" className="loading-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-view-container">
        <Container className="mt-5">
          <Alert variant="danger" className="error-alert">
            {error}
            <div className="mt-3">
              <Button variant="primary" onClick={() => navigate('/products')} className="back-button">
                Back to Products
              </Button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-view-container">
        <Container className="mt-5">
          <Alert variant="warning" className="warning-alert">
            Product not found
            <div className="mt-3">
              <Button variant="primary" onClick={() => navigate('/products')} className="back-button">
                Back to Products
              </Button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="product-view-container">
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="product-detail-card">
              <Card.Body>
                <div className="mb-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/products')}
                    className="back-button mb-3"
                  >
                    ← Back to Products
                  </Button>
                </div>
                
                {product.image && (
                  <div className="product-image-container text-center mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                )}
                
                <Card.Title className="product-title">{product.name}</Card.Title>
                
                <Card.Subtitle className="product-subtitle">Description:</Card.Subtitle>
                <Card.Text className="product-text mb-4">{product.description}</Card.Text>
                
                <Card.Subtitle className="product-subtitle">Price:</Card.Subtitle>
                <Card.Text className="product-price mb-4">&#8369; {product.price.toFixed(2)}</Card.Text>
                
                <Card.Subtitle className="product-subtitle">Status:</Card.Subtitle>
                <Card.Text className="product-text mb-4">
                  {product.isActive ? (
                    <span className="status-available">Available</span>
                  ) : (
                    <span className="status-unavailable">Not Available</span>
                  )}
                </Card.Text>

                <Card.Subtitle className="product-subtitle">Quantity:</Card.Subtitle>
                <div className="quantity-controls d-flex align-items-center mb-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="quantity-input mx-2 text-center"
                    style={{ width: '75px' }}
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="quantity-btn"
                  >
                    +
                  </Button>
                </div>
                
                <div className="d-grid gap-2">
                  {user.id !== null ? (
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => addToCart(productId)}
                      disabled={isAddingToCart || !product.isActive}
                      className="add-to-cart-btn"
                    >
                      {isAddingToCart ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          {' Adding...'}
                        </>
                      ) : product.isActive ? 'Add to Cart' : 'Product Not Available'}
                    </Button>
                  ) : (
                    <Button 
                      as={Link} 
                      to="/login" 
                      variant="danger" 
                      size="lg"
                      className="login-btn"
                    >
                      Log in to Purchase
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}