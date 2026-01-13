
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = ({ cart, totals, clearCart }) => { 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', phone: '', address: '', city: 'Lahore'
    });

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

      
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : 0; 

        const orderData = {
            user_id: userId,
            customer_name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            total_amount: totals.grandTotal,
            cart_items: cart
        };

        try {
            const res = await axios.post('http://humancare.mywebcommunity.org/backend/place_order.php', orderData);
            
            if (res.data.success) {
                alert("Order Placed Successfully!");
                clearCart();
                navigate('/'); 
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) { alert("Server Error. Check Backend Connection."); }
    };

    return (
        <Container className="mt-5 mb-5">
            <h2 className="fw-bold mb-4">Checkout</h2>
            <Row>
               
                <Col md={7}>
                    <Card className="p-4 shadow-sm border-0">
                        <h5 className="fw-bold mb-3">Shipping Details</h5>
                        <Form onSubmit={handlePlaceOrder}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control name="name" onChange={handleChange} required placeholder="Your Name" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control name="phone" onChange={handleChange} required placeholder="0300-1234567" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Select name="city" onChange={handleChange}>
                                    <option value="Lahore">Lahore</option>
                                    <option value="Karachi">Karachi</option>
                                    <option value="Islamabad">Islamabad</option>
                                    <option value="Multan">Multan</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Complete Address</Form.Label>
                                <Form.Control as="textarea" rows={2} name="address" onChange={handleChange} required placeholder="House No, Street, Area..." />
                            </Form.Group>

                            <h5 className="fw-bold mt-4 mb-3">Payment Method</h5>
                            <div className="p-3 border rounded bg-light mb-3">
                                <Form.Check type="radio" label="Cash on Delivery (COD)" checked readOnly />
                            </div>

                            <Button variant="primary" type="submit" size="lg" className="w-100 mt-2">
                                Place Order (Rs. {totals.grandTotal})
                            </Button>
                        </Form>
                    </Card>
                </Col>

               
                <Col md={5}>
                    <Card className="shadow-sm border-0 bg-light">
                        <Card.Header className="bg-white fw-bold">Order Summary</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush" className="mb-3">
                                {cart.map((item, idx) => (
                                    <ListGroup.Item key={idx} className="bg-transparent d-flex justify-content-between align-items-center px-0">
                                        <div className="d-flex align-items-center">
                                            <span className="badge bg-secondary me-2">{item.qty}x</span>
                                            <div>
                                                <div className="fw-bold text-dark" style={{fontSize:'14px'}}>{item.name}</div>
                                                <small className="text-muted">Unit: {item.unit}</small>
                                            </div>
                                        </div>
                                        <span className="fw-bold">Rs. {item.price * item.qty}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span>Rs. {totals.subTotal}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Delivery Charges</span>
                                <span>Rs. {totals.deliveryCharges}</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold border-top pt-3 mt-2 fs-5">
                                <span>Total Payable</span>
                                <span className="text-primary">Rs. {totals.grandTotal}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;