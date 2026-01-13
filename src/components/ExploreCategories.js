import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

import img1 from '../assets/cat-1.png'; 
import img2 from '../assets/cat-2.png';
import img3 from '../assets/cat-3.png';
import img4 from '../assets/cat-4.png';
import img5 from '../assets/cat-5.png';
import img6 from '../assets/cat-6.png';
import img7 from '../assets/cat-7.png';
import img8 from '../assets/cat-8.png';

const categories = [
    { name: "Featured Medicines", img: img1, color: "#e3f2fd" },
    { name: "Over The Counter", img: img2, color: "#fff3e0" },
    { name: "Family Care", img: img3, color: "#fce4ec" },
    { name: "Herbals & Alternatives", img: img4, color: "#e8f5e9" },
    { name: "Households & Cosmetics", img: img5, color: "#fff8e1" },
    { name: "Devices & Injectables", img: img6, color: "#f3e5f5" },
    { name: "Wellness & Beauty", img: img7, color: "#e0f7fa" },
    { name: "Sexual Health", img: img8, color: "#f1f8e9" },
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
                            <div style={{ width: '80px', height: '80px', overflow: 'hidden', borderRadius: '10px' }}>
                                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
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
