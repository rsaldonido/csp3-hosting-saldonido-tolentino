import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductCard from './ProductCard';
import '../styles/UserView.css';

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
            <div className="no-products-message">
                <h4>No products available at the moment</h4>
                <p>Please check back later!</p>
            </div>
        );
    }

    return (
        <Container fluid className="user-view-container px-0 mx-0">
            <Form className="search-filter-form my-4 px-3">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={changeEvent => setSearchTerm(changeEvent.target.value)}
                        className="form-control-tech-search"
                    />
                </Form.Group>
                <div className="d-flex gap-3 flex-wrap">
                    <Form.Group>
                        <Form.Label className="filter-label-tech">Min Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={changeEvent => setMinPrice(changeEvent.target.value)}
                            className="form-control-tech-search"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="filter-label-tech">Max Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={changeEvent => setMaxPrice(changeEvent.target.value)}
                            className="form-control-tech-search"
                        />
                    </Form.Group>
                </div>
            </Form>

            <Row xs={1} sm={2} md={3} lg={4} className="g-4 px-3 pb-5 product-grid-container">
                {filteredProducts.map(product => (
                    <Col key={product._id}>
                        <ProductCard productProp={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
