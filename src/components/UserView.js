import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function UserView({ productsData = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const activeProducts = productsData.filter(product => product.isActive);

    const filteredProducts = activeProducts.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const price = product.price;
        const matchesPrice =
            (!minPrice || price >= Number(minPrice)) &&
            (!maxPrice || price <= Number(maxPrice));

        return matchesSearch && matchesPrice;
    });

    if (activeProducts.length === 0) {
        return (
            <div className="text-center py-5">
                <h4>No products available at the moment</h4>
                <p>Please check back later!</p>
            </div>
        );
    }

    return (
        <Container fluid className="px-0 mx-0">
            <Form className="my-4 px-3">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Form.Group>
                <div className="d-flex gap-3 flex-wrap">
                    <Form.Group>
                        <Form.Label>Min Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Max Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                        />
                    </Form.Group>
                </div>
            </Form>

            <Row xs={1} sm={2} md={3} lg={4} className="g-4 px-3 pb-5">
                {filteredProducts.map(product => (
                    <Col key={product._id}>
                        <ProductCard productProp={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
