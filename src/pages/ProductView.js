import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

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

    const addToCart = (productId) => {
        setIsAddingToCart(true);
        
        fetch("http://localhost:4000/cart/add-to-cart", {
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
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
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
            console.error("Add to cart error:", err);
            notyf.error(err.message || "Failed to add item to cart");
        })
        .finally(() => {
            setIsAddingToCart(false);
        });
    };

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        fetch(`http://localhost:4000/products/${productId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Product not found');
            }
            return res.json();
        })
        .then(data => {
            if (!data || !data._id) {
                throw new Error('Invalid product data');
            }
            setProduct(data);
        })
        .catch(err => {
            console.error("Fetch product error:", err);
            setError(err.message);
            setProduct(null);
        })
        .then(() => {
            setIsLoading(false);
        });
    }, [productId]);

    if (isLoading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    {error}
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/products')}>
                            Back to Products
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Product not found
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/products')}>
                            Back to Products
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }
    
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="mb-4">
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => navigate('/products')}
                                    className="mb-3"
                                >
                                    ← Back to Products
                                </Button>
                            </div>
                            
                            <Card.Title className="text-center mb-4">{product.name}</Card.Title>
                            
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text className="mb-4">{product.description}</Card.Text>
                            
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text className="mb-4">PhP {product.price.toFixed(2)}</Card.Text>
                            
                            <Card.Subtitle>Status:</Card.Subtitle>
                            <Card.Text className="mb-4">
                                {product.isActive ? (
                                    <span className="text-success">Available</span>
                                ) : (
                                    <span className="text-danger">Not Available</span>
                                )}
                            </Card.Text>

                            {/* Quantity Selector */}
                            <Card.Subtitle>Quantity:</Card.Subtitle>
                            <div className="d-flex align-items-center mb-4">
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                                    className="mx-2 text-center"
                                    style={{ width: '60px' }}
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setQuantity(prev => prev + 1)}
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
    );
}