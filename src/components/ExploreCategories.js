// src/components/ExploreCategories.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const categories = [
    { name: "Featured Medicines", img: "https://healthwire.pk/assets/img/cat-1.png", color: "#e3f2fd" },
    { name: "Over The Counter", img: "https://healthwire.pk/assets/img/cat-2.png", color: "#fff3e0" },
    { name: "Family Care", img: "https://healthwire.pk/assets/img/cat-3.png", color: "#fce4ec" },
    { name: "Herbals & Alternatives", img: "https://healthwire.pk/assets/img/cat-4.png", color: "#e8f5e9" },
    { name: "Households & Cosmetics", img: "https://healthwire.pk/assets/img/cat-5.png", color: "#fff8e1" },
    { name: "Devices & Injectables", img: "https://healthwire.pk/assets/img/cat-6.png", color: "#f3e5f5" },
    { name: "Wellness & Beauty", img: "https://healthwire.pk/assets/img/cat-7.png", color: "#e0f7fa" },
    { name: "Sexual Health", img: "https://healthwire.pk/assets/img/cat-8.png", color: "#f1f8e9" },
];

const ExploreCategories = () => {
    return (
        <Container className="mt-5">
            <h3 className="fw-bold mb-4">Explore By Categories</h3>
            <Row>
                {categories.map((cat, index) => (
                    <Col md={3} sm={6} xs={12} key={index} className="mb-4">
                        <Card className="border-0 shadow-sm p-2 d-flex flex-row align-items-center" 
                              style={{ borderRadius: '12px', cursor: 'pointer', height: '100px' }}>
                            {/* Image Left */}
                            <div style={{ width: '80px', height: '80px', overflow: 'hidden', borderRadius: '10px' }}>
                                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            {/* Text Right */}
                            <div className="ms-3">
                                <h6 className="fw-bold mb-0" style={{ fontSize: '15px' }}>{cat.name}</h6>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ExploreCategories;