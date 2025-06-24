import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function CartView() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tempQuantities, setTempQuantities] = useState({});

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4000/cart/get-cart', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch cart');
            
            const data = await response.json();
            setCart(data.cart);
        } catch (err) {
            console.error("Fetch cart error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user.id) {
            fetchCart();
        } else {
            setIsLoading(false);
        }
    }, [user.id]);

    const updateQuantity = async (productId, newQuantity) => {
            
            if (!newQuantity || newQuantity < 1 || isNaN(newQuantity)) {
                notyf.error('Please enter a valid quantity (minimum 1)');
                return;
            }

            try {
                const response = await fetch('http://localhost:4000/cart/update-cart-quantity', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        productId,
                        newQuantity: parseInt(newQuantity)
                    })
                });
                
                if (!response.ok) throw new Error('Failed to update quantity');
                
                notyf.success('Quantity updated');
                fetchCart();
                
                setTempQuantities(prev => {
                    const updated = { ...prev };
                    delete updated[productId];
                    return updated;
                });
            } catch (err) {
                console.error("Update error:", err);
                notyf.error(err.message);
            }
        };

        const handleQuantityInputChange = (productId, value) => {
           
            setTempQuantities(prev => ({
                ...prev,
                [productId]: value
            }));
        };

        const handleQuantitySubmit = (productId, value) => {
            const numValue = Number(value);
            if (value.trim() === '' || numValue < 1 || isNaN(numValue)) {
         
                setTempQuantities(prev => {
                    const updated = { ...prev };
                    delete updated[productId];
                    return updated;
                });
                notyf.error('Please enter a valid quantity (minimum 1)');
                return;
            }
            updateQuantity(productId, numValue);
        };

    const removeItem = async (productId) => {
        try {
            const response = await fetch(`http://localhost:4000/cart/${productId}/remove-from-cart`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to remove item');
            
            notyf.success('Item removed from cart');
            fetchCart();
        } catch (err) {
            console.error("Remove error:", err);
            notyf.error(err.message);
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch('http://localhost:4000/cart/clear-cart', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to clear cart');
            
            notyf.success('Cart cleared');
            fetchCart();
        } catch (err) {
            console.error("Clear error:", err);
            notyf.error(err.message);
        }
    };

    const checkout = async () => {
        try {
            const response = await fetch('http://localhost:4000/orders/checkout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to checkout');
            
            notyf.success('Order placed successfully');
            navigate('/products');
        } catch (err) {
            console.error("Checkout error:", err);
            notyf.error(err.message);
        }
    };

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
                </Alert>
            </Container>
        );
    }

    if (!user.id) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Please log in to view your cart
                </Alert>
            </Container>
        );
    }

    if (!cart || cart.cartItems.length === 0) {
        return (
            <Container className="mt-5">
                <Alert variant="info">
                    Your cart is empty
                </Alert>
                <Button variant="primary" onClick={() => navigate('/products')}>
                    Browse Products
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
                   <h2 className="mb-4">Your Cart</h2>
                   <Table striped bordered hover responsive>
                       <thead>
                           <tr>
                               <th>Product</th>
                               <th>Price</th>
                               <th>Quantity</th>
                               <th>Subtotal</th>
                               <th>Actions</th>
                           </tr>
                       </thead>
                       <tbody>
                           {cart.cartItems.map(item => (
                               <tr key={item.productId}>
                                   <td>{item.productId}</td>
                                   <td>PhP {item.subtotal / item.quantity}</td>
                                   <td>
                                       <div className="d-flex align-items-center">
                                           <Button 
                                               variant="outline-secondary" 
                                               size="sm"
                                               onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                               disabled={item.quantity <= 1}
                                           >
                                               -
                                           </Button>
                                           <Form.Control
                                               type="number"
                                               min="1"
                                               value={tempQuantities[item.productId] !== undefined ? tempQuantities[item.productId] : item.quantity}
                                               onChange={e => handleQuantityInputChange(item.productId, e.target.value)}
                                               onBlur={e => handleQuantitySubmit(item.productId, e.target.value)}
                                               onKeyPress={e => {
                                                   if (e.key === 'Enter') {
                                                       handleQuantitySubmit(item.productId, e.target.value);
                                                   }
                                               }}
                                               className="mx-2 text-center"
                                               style={{ width: '60px' }}
                                           />
                                           <Button 
                                               variant="outline-secondary" 
                                               size="sm"
                                               onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                           >
                                               +
                                           </Button>
                                       </div>
                                   </td>
                                   <td>PhP {item.subtotal.toFixed(2)}</td>
                                   <td>
                                       <Button 
                                           variant="danger" 
                                           size="sm"
                                           onClick={() => removeItem(item.productId)}
                                       >
                                           Remove
                                       </Button>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                       <tfoot>
                           <tr>
                               <td colSpan="3" className="text-end fw-bold">Total:</td>
                               <td className="fw-bold">PhP {cart.totalPrice.toFixed(2)}</td>
                               <td></td>
                           </tr>
                       </tfoot>
                   </Table>
                   
                   <div className="d-flex justify-content-between mt-4">
                       <Button variant="danger" onClick={clearCart}>
                           Clear Cart
                       </Button>
                       <Button variant="success" onClick={checkout}>
                           Checkout
                       </Button>
                   </div>
               </Container>
           );
}