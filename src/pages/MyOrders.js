import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/MyOrders.css';

export default function MyOrders() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState({});

    // Function to fetch product details
    const fetchProductDetails = (productId) => {
        return fetch(`https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/products/${productId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch product');
                return res.json();
            })
            .then(product => {
                return { productId, product };
            })
            .catch(err => {
                console.error('Fetch product error:', err);
                return { productId, product: { name: 'Product not found' } };
            });
    };

    const fetchOrders = () => {
        setIsLoading(true);
        setError(null);
        
        fetch('https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/orders/my-orders', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return response.json();
        })
        .then(data => {
            const orders = data.orders || [];
            setOrders(orders);

            // Create an array of all product IDs from all orders
            const allProductIds = orders.flatMap(order => 
                order.productsOrdered.map(item => item.productId)
            );

            // Remove duplicates
            const uniqueProductIds = [...new Set(allProductIds)];

            // Fetch details for all unique products
            const productFetches = uniqueProductIds.map(productId => 
                fetchProductDetails(productId)
            );

            return Promise.all(productFetches);
        })
        .then(productResults => {
            // Create a products object with productId as key
            const productsMap = {};
            productResults.forEach(({ productId, product }) => {
                productsMap[productId] = product;
            });
            setProducts(productsMap);
        })
        .catch(err => {
            console.error("Fetch orders error:", err);
            setError(err.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const cancelOrder = (orderId) => {
        fetch(`https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/orders/${orderId}/update-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {
            notyf.success(data.message || 'Order cancelled successfully');
            fetchOrders();
        })
        .catch(err => {
            notyf.error(err.error || err.message || 'Failed to cancel order');
        });
    };

    useEffect(() => {
        if (user.isAdmin) {
            navigate('/products');
            return;
        }

        if (user.id) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [user.id, user.isAdmin, navigate]);

    
    if (isLoading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" className="loading-spinner-myorders">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger" className="alert-tech-myorders alert-danger">
                    {error}
                    <Button 
                        variant="primary" 
                        onClick={fetchOrders}
                        className="ms-3 alert-tech-btn-primary"
                    >
                        Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!user.id) {
        return (
            <Container className="mt-5">
                <Alert variant="warning" className="alert-tech-myorders alert-warning">
                    Please log in to view your orders
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/login')} className="alert-tech-btn-primary">
                            Log In
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container className="mt-5">
                <Alert variant="info" className="alert-tech-myorders alert-info">
                    You haven't placed any orders yet
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/products')} className="alert-tech-btn-primary">
                            Browse Products
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }


    return (
        <Container className="my-orders-container mt-5">
            <h2 className="my-orders-title mb-4">My Orders</h2>
            <Table striped bordered hover responsive className="my-orders-table">
                <thead>
                    <tr className="text-center">
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} className="align-middle">
                            <td className="order-id-display">{order._id.slice(-6).toUpperCase()}</td>
                            <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                            <td>
                                <ul className="order-items-list mb-0 list-unstyled text-center">
                                    {order.productsOrdered.map(item => (
                                        <li key={item.productId}>
                                            {products[item.productId]?.name || 'Loading...'}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul className="mb-0 list-unstyled text-center">
                                    {order.productsOrdered.map(item => (
                                        <li key={item.productId}>
                                            {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="order-total-price">&#8369; {order.totalPrice.toFixed(2)}</td>
                            <td className="text-center">
                                <Badge className={
                                    order.status === 'Pending' ? 'status-badge-myorders status-pending-myorders' :
                                    order.status === 'Dispatched' ? 'status-badge-myorders status-dispatched-myorders' :
                                    order.status === 'Completed' ? 'status-badge-myorders status-completed-myorders' : 'status-badge-myorders status-cancelled-myorders'
                                }>
                                    {order.status}
                                </Badge>
                            </td>
                            <td className="text-center">
                                {order.status === 'Pending' && (
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => cancelOrder(order._id)}
                                        className="cancel-order-btn"
                                    >
                                        Cancel Order
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
