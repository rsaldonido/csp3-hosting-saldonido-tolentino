import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import '../styles/Products.css';

export default function Products() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = () => {
        setIsLoading(true);
        setError(null);

        const fetchUrl = user.isAdmin 
            ? "http://localhost:4000/products/all" 
            : "http://localhost:4000/products/active";

        fetch(fetchUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                setError('Invalid data format received');
                setProducts([]);
            } else {
                setProducts(data);
                setError(null);
            }
            setIsLoading(false);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            setError(err.message);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, [user.isAdmin]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <Container className="text-center">
                    <Spinner animation="border" role="status" className="loading-spinner">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Container>
                    <Alert variant="danger" className="error-alert">
                        {error}
                        <Button 
                            variant="primary" 
                            onClick={fetchData}
                            className="retry-btn"
                        >
                            Retry
                        </Button>
                    </Alert>
                </Container>
            </div>
        );
    }

    return (
        <div className="products-container">
            {user.isAdmin ? (
                <>
                    <h1 className="products-title admin-title">Admin Dashboard</h1>
                    <Container>
                        <AdminView productsData={products} fetchData={fetchData} />
                    </Container>
                </>
            ) : (
                <>
                    <h1 className="products-title">Our Products</h1>
                    <Container>
                        <UserView productsData={products} />
                    </Container>
                </>
            )}
        </div>
    );
}
