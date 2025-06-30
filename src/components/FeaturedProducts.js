import { useState, useEffect } from 'react';
import { Row, Container, Col } from 'react-bootstrap';
import PreviewProducts from './PreviewProducts';
import '../styles/FeaturedProducts.css';

export default function FeaturedProducts() {
    const [previews, setPreviews] = useState([]);
    const [isReady, setIsReady] = useState(false); 

    useEffect(() => {
        let isMounted = true; 

        fetch("https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/products/active")
            .then(response => response.json())
            .then(data => {
                if (!isMounted) return;

                const numbers = [];
                const featured = [];

                
                while (numbers.length < Math.min(5, data.length)) {
                    const randomNum = Math.floor(Math.random() * data.length);
                    if (!numbers.includes(randomNum)) {
                        numbers.push(randomNum);
                    }
                }

                
                numbers.forEach(index => {
                    featured.push(data[index]);
                });

                
                if (isMounted) {
                    setPreviews(featured);
                    setIsReady(true);
                }
            })
            .catch(error => {
                // console.error("Error fetching products:", error);
                if (isMounted) setIsReady(true);
            });

        return () => {
            isMounted = false; 
        };
    }, []);

    
    if (!isReady) {
        return null;
    }

    return (
        <Container fluid className="featured-products-container">

            <h2 className="text-center mb-4 featured-product-title animate">
                Featured Products
            </h2>
            
            <Row className="g-3 justify-content-center">
                {previews.map((product) => (
                    <Col 
                        key={product._id} 
                        xs={12} sm={6} md={4} lg={true} 
                        // style={{ maxWidth: '300px' }}
                    >
                        <PreviewProducts data={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}