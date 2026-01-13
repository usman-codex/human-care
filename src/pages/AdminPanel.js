
import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const AdminPanel = () => {
    const [product, setProduct] = useState({
        name: '', category: '', section: 'featured', price: '', old_price: '', discount: '', image: '', description: ''
    });

    const handleChange = (e) => setProduct({...product, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://humancare.mywebcommunity.org/backend/add_product.php', product);
            if(res.data.success) alert("Product Added!");
            else alert("Error");
        } catch(err) { alert("Server Error"); }
    };

    return (
        <Container className="mt-5 mb-5">
            <Card className="p-4 shadow">
                <h3 className="text-primary mb-4">Admin: Add New Medicine</h3>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3"><Form.Label>Medicine Name</Form.Label>
                            <Form.Control name="name" onChange={handleChange} required placeholder="e.g Panadol" /></Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3"><Form.Label>Category (Type)</Form.Label>
                            <Form.Control name="category" onChange={handleChange} placeholder="e.g Tablet, Syrup" /></Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3"><Form.Label>Show in Section</Form.Label>
                            <Form.Select name="section" onChange={handleChange}>
                                <option value="featured">Featured Medicines</option>
                                <option value="devices">Devices & Injectables</option>
                                <option value="family">Family Care</option>
                                <option value="herbal">Herbals & Alternatives</option>
                                <option value="cosmetics">Households & Cosmetics</option>
                            </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3"><Form.Label>Image URL</Form.Label>
                            <Form.Control name="image" onChange={handleChange} placeholder="https://..." /></Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Price</Form.Label>
                        <Form.Control name="price" onChange={handleChange} required /></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Old Price</Form.Label>
                        <Form.Control name="old_price" onChange={handleChange} /></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Discount %</Form.Label>
                        <Form.Control name="discount" onChange={handleChange} placeholder="e.g 10" /></Form.Group></Col>
                    </Row>

                    <Button variant="primary" type="submit" className="w-100">Add Product</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default AdminPanel;