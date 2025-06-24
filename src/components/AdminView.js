import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import PropTypes from 'prop-types';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const AdminOrders = () => {
    const notyf = new Notyf();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4000/orders/all-orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch orders');
            
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (err) {
            console.error("Fetch orders error:", err);
            notyf.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:4000/orders/${orderId}/update-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({status: newStatus })
            });
            
            if (!response.ok) throw new Error('Failed to update status');
            
            notyf.success('Status updated successfully');
            fetchOrders();
        } catch (err) {
            console.error("Update error:", err);
            notyf.error(err.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading orders...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Table striped bordered hover responsive className="mt-3">
            <thead>
                <tr className="text-center">
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                    orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.userId}</td>
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
                            <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                            <td>
                                <span className={`badge ${
                                    order.status === 'Pending' ? 'bg-warning' :
                                    order.status === 'Shipped Out' ? 'bg-info' :
                                    order.status === 'Completed' ? 'bg-success' : 'bg-danger'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>
                                <select 
                                    className="form-select form-select-sm"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped Out">Shipped Out</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center py-4">
                            No orders found
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default function AdminView({ productsData, fetchData }) {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <>
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                id="admin-tabs"
                className="mb-4"
            >
                <Tab eventKey="products" title="Products">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr className="text-center">
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th colSpan="2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>PhP {product.price.toFixed(2)}</td>
                                    <td className={product.isActive ? "text-success" : "text-danger"}>
                                        {product.isActive ? "Available" : "Unavailable"}
                                    </td>
                                    <td className="text-center">
                                        <EditProduct product={product} fetchData={fetchData} />
                                    </td>
                                    <td className="text-center">
                                        <ArchiveProduct 
                                            product={product} 
                                            isActive={product.isActive} 
                                            fetchData={fetchData} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                
                <Tab eventKey="orders" title="Orders">
                    <AdminOrders />
                </Tab>
            </Tabs>
        </>
    );
}

AdminView.propTypes = {
    productsData: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            isActive: PropTypes.bool.isRequired
        })
    ).isRequired,
    fetchData: PropTypes.func.isRequired
};