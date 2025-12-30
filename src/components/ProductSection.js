// src/components/ProductSection.js
import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProductSection = ({ allProducts, addToCart }) => {
    const [activeTab, setActiveTab] = useState('devices');

    // Filter Logic (Show only latest 4 items)
    const filteredProducts = allProducts
        .filter(p => p.section === activeTab)
        .slice(0, 4); // Only 1 Row

    const tabs = [
        { key: 'devices', label: 'Devices' },
        { key: 'family', label: 'Family Care' },
        { key: 'herbal', label: 'Herbals' },
        { key: 'cosmetics', label: 'Cosmetics' },
        { key: 'wellness', label: 'Wellness' },
        { key: 'sexual', label: 'Sexual Health' },
    ];

    return (
        <div style={{background: '#f0f2f5', padding: '50px 0'}}>
            <Container>
                {/* HEADER & TABS */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-3 mb-md-0">Shop by Category</h3>
                    
                    <div className="d-flex overflow-auto pb-2" style={{gap:'10px'}}>
                        {tabs.map((tab) => (
                            <Button 
                                key={tab.key}
                                variant={activeTab === tab.key ? "primary" : "white"}
                                className={`rounded-pill px-4 shadow-sm border-0 fw-bold ${activeTab !== tab.key ? 'text-dark bg-white' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                                style={{transition:'0.3s', whiteSpace:'nowrap'}}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* PRODUCTS GRID (Animated) */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Row>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <Col xs={12} sm={6} md={3} key={item.id} className="mb-4">
                                        <ProductCard product={item} addToCart={addToCart} />
                                    </Col>
                                ))
                            ) : (
                                <Col className="text-center py-5">
                                    <div className="p-5 bg-white rounded shadow-sm">
                                        <h5 className="text-muted">Coming Soon...</h5>
                                        <p className="small text-muted">We are stocking up {activeTab} products!</p>
                                    </div>
                                </Col>
                            )}
                        </Row>
                        
                        {filteredProducts.length > 0 && (
                            <div className="text-center mt-3">
                                <Button variant="outline-dark" className="rounded-pill px-5">
                                    View All {activeTab} Products <FaChevronRight size={12} className="ms-2"/>
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Container>
        </div>
    );
};

export default ProductSection;