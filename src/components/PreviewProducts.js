import { Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/PreviewProducts.css';

export default function PreviewProducts(props){

	const { breakPoint, data } = props;

	const { _id, name, description, price } = data;

	return(
		<Col xs={12} md={ breakPoint }>
			<Card className="cardHighlight highlight-cards mx-2">
				<Card.Body>
					<Card.Title className="text-center">
						{/*Add the specific details of course link*/}
						<Link to={`/products/${_id}`}>{ name }</Link>
					</Card.Title>
					<Card.Text>{ description }</Card.Text>
					
				</Card.Body>
				<Card.Footer>
					<h5 className="text-center price-tag">₱{ price }</h5>
					<Link className="btn btn-primary btn-details d-block" to={`/products/${	_id}`}>Details</Link>
				</Card.Footer>
			</Card>
		</Col>
	)
}