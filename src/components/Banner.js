import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Banner.css';

export default function Banner({ data }) {
    const { title, content, destination, buttonLabel, backgroundImage } = data;

    return (
        <Row>
            <Col>
                <div 
                    className="banner-container rounded"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="banner-content">
                        <h1>{title}</h1>
                        <p>{content}</p>
                        <Link className="btn btn-primary" to={destination}>
                            {buttonLabel}
                        </Link>
                    </div>
                </div>
            </Col>
        </Row>
    );
}