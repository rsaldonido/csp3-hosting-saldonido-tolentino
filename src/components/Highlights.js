import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import '../styles/Highlights.css';

export default function Highlights() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Row className="mt-3 mb-3">
      <Col xs={12} md={12} xl={4}>
        <Card className={`cardHighlight p-3 ${isMounted ? 'visible' : ''}`}>
          <Card.Body>
            <Card.Title>
              <h2>Seamless Shopping Experience</h2>
            </Card.Title>
            <Card.Text>
              Browse, search, and shop with ease using our intuitive and responsive platform. With smart filters, and a smooth checkout process, finding what you need has never been faster or more enjoyable. Whether you're on mobile or desktop, your perfect product is just a few clicks away.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={6} xl={4}>
        <Card className={`cardHighlight p-3 ${isMounted ? 'visible' : ''}`}>
          <Card.Body>
            <Card.Title>
              <h2>Fast & Reliable Delivery</h2>
            </Card.Title>
            <Card.Text>
              We partner with trusted couriers to bring your orders straight to your doorstep quickly and reliably. Track your delivery in real-time and rest assured knowing your items will arrive safely and on schedule. Say goodbye to long waits and hello to convenience.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={6} xl={4}>
        <Card className={`cardHighlight p-3 ${isMounted ? 'visible' : ''}`}>
          <Card.Body>
            <Card.Title>
              <h2>Secure Payments & Buyer Protection</h2>
            </Card.Title>
            <Card.Text>
              Your safety is our top priority. Enjoy peace of mind with encrypted payment gateways, multiple secure options, and a hassle-free return policy. Shop confidently knowing that your personal and payment information is fully protected, and your satisfaction is guaranteed.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}