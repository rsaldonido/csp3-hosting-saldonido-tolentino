import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function MyOrders() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = () => {
        setIsLoading(true);
        setError(null);
        
        fetch('http://localhost:4000/orders/my-orders', {
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
            setOrders(data.orders || []);
            setIsLoading(false);
        })
        .catch(err => {
            console.error("Fetch orders error:", err);
            setError(err.message);
            setIsLoading(false);
        });
    };

    const cancelOrder = (orderId) => {
        fetch(`http://localhost:4000/orders/${orderId}/cancel`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }
            return response.json();
        })
        .then(data => {
            notyf.success('Order cancelled successfully');
            fetchOrders();
        })
        .catch(err => {
            console.error("Cancel error:", err);
            notyf.error(err.message);
        });
    };

    useEffect(() => {
        if (user.id) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [user.id]);

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
                    <Button 
                        variant="primary" 
                        onClick={fetchOrders}
                        className="ms-3"
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
                <Alert variant="warning">
                    Please log in to view your orders
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/login')}>
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
                <Alert variant="info">
                    You haven't placed any orders yet
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/products')}>
                            Browse Products
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="mb-4">My Orders</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id.slice(-6).toUpperCase()}</td>
                            <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                            <td>
                                <ul className="mb-0">
                                    {order.productsOrdered.map(item => (
                                        <li key={item.productId}>
                                            {item.productId} (Qty: {item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>PhP {order.totalPrice.toFixed(2)}</td>
                            <td>
                                <Badge bg={
                                    order.status === 'Pending' ? 'warning' :
                                    order.status === 'Shipped Out' ? 'info' :
                                    order.status === 'Completed' ? 'success' : 'danger'
                                }>
                                    {order.status}
                                </Badge>
                            </td>
                            <td>
                                {order.status === 'Pending' && (
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => cancelOrder(order._id)}
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