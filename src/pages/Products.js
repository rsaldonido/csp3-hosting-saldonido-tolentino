import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';

export default function Products() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const fetchUrl = user.isAdmin 
                ? "http://localhost:4000/products/all" 
                : "http://localhost:4000/products/active";

            const response = await fetch(fetchUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (!Array.isArray(data)) throw new Error('Invalid data format received');
            
            setProducts(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.isAdmin]);

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
                        onClick={fetchData}
                        className="ms-3"
                    >
                        Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <h1 className="my-5 text-center">Our Products</h1>
            {user.isAdmin ? (
                <AdminView productsData={products} fetchData={fetchData} />
            ) : (
                <UserView productsData={products} />
            )}
        </>
    );
}