import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import PropTypes from 'prop-types';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/AdminView.css';

const AdminOrders = () => {
    const notyf = new Notyf();
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});
    const [products, setProducts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = () => {
        setIsLoading(true);

        fetch('http://localhost:4000/orders/all-orders', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const allOrders = data.orders || [];
            setOrders(allOrders);

            const userIds = [...new Set(allOrders.map(order => order.userId))];
            const productIds = [...new Set(allOrders.flatMap(order => order.productsOrdered.map(p => p.productId)))];

            Promise.all([
                fetch('http://localhost:4000/users/all', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }),
                fetch('http://localhost:4000/products/all', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            ])
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(([usersData, productsData]) => {
                const usersMap = usersData.reduce((acc, user) => {
                    acc[user._id] = user.email;
                    return acc;
                }, {});
                const productsMap = productsData.reduce((acc, product) => {
                    acc[product._id] = product.name;
                    return acc;
                }, {});
                setUsers(usersMap);
                setProducts(productsMap);
                setIsLoading(false);
            });
        });
    };

    const updateStatus = (orderId, newStatus) => {
        fetch(`http://localhost:4000/orders/${orderId}/update-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(res => res.json())
        .then(() => {
            notyf.success('Status updated successfully');
            fetchOrders();
        });
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
        <Table striped bordered hover responsive className="admin-table mt-3">
            <thead>
                <tr>
                    <th className="text-start">Order#</th> 
                    <th className="text-start">Date</th> 
                    <th className="text-start">User Email</th>
                    <th className="text-center">Products</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="align-middle">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <tr key={order._id}>
                            <td className="order-id-admin text-start">{order._id.slice(-6).toUpperCase()}</td>
                            <td className="text-start">{new Date(order.orderedOn).toLocaleDateString()}</td>
                            <td className="text-center">{users[order.userId] || 'Loading...'}</td>
                            <td>
                                <ul className="text-start mb-0">
                                    {order.productsOrdered.map(item => (
                                        <li key={item.productId}>
                                            {products[item.productId] || 'Loading...'} (Qty: {item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="order-total-admin text-center">&#8369; {order.totalPrice.toFixed(2)}</td>
                            <td className="text-center">
                                <span className={`status-badge-admin ${
                                    order.status === 'Pending' ? 'status-pending-admin' :
                                    order.status === 'Dispatched' ? 'status-dispatched-admin' :
                                    order.status === 'Completed' ? 'status-completed-admin' : 'status-cancelled-admin'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="text-center">
                                <select 
                                    className="admin-select-status"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Dispatched">Dispatched</option>
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
                className="admin-tabs mb-4"
            >
                <Tab eventKey="products" title="Products">
                    <Table striped bordered hover responsive className="admin-table align-middle">
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
                                    <td className="order-total-admin">&#8369; {product.price.toFixed(2)}</td>
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
