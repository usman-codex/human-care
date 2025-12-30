// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Pagination } from 'react-bootstrap';
import HeroSlider from '../components/HeroSlider';
import ExploreCategories from '../components/ExploreCategories';
import ProductSection from '../components/ProductSection';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const Home = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    
    // Pagination States for "All Medicines"
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // 5 Rows x 4 Items = 20

    useEffect(() => {
        axios.get('http://localhost/human-care/backend/get_products.php')
            .then(res => setProducts(res.data))
            .catch(err => console.log("Error:", err));
    }, []);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAllProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
            
            {/* 1. HERO SLIDER */}
            <HeroSlider />
            
            {/* 2. EXPLORE CATEGORIES */}
            <ExploreCategories />

            {/* 3. TABS SECTION (Devices, Family Care etc) - MOVED UP */}
            <ProductSection allProducts={products} addToCart={addToCart} />

            {/* 4. FEATURED MEDICINES (Highlight Section) */}
            <section className="py-5" style={{background:'#fff'}}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-dark">Featured Medicines</h2>
                        <Button variant="outline-primary" className="rounded-pill px-4">View All</Button>
                    </div>
                    
                    <Row>
                        {products.filter(p => p.section === 'featured').slice(0, 4).map((item) => (
                            <Col xs={12} sm={6} md={3} key={item.id} className="mb-4">
                                <ProductCard product={item} addToCart={addToCart} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* 5. ALL MEDICINES SECTION (With Pagination) */}
            <Container className="mt-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">All Medicines</h2>
                    <p className="text-muted">Browse our complete inventory</p>
                    <div style={{width:'60px', height:'4px', background:'#2761e7', margin:'0 auto'}}></div>
                </div>

                <Row>
                    {currentAllProducts.map((item) => (
                        <Col xs={12} sm={6} md={3} key={item.id} className="mb-4">
                            <motion.div initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:0.5}}>
                                <ProductCard product={item} addToCart={addToCart} />
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.Prev 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1} 
                            />
                            {[...Array(totalPages)].map((_, idx) => (
                                <Pagination.Item 
                                    key={idx+1} 
                                    active={idx+1 === currentPage}
                                    onClick={() => setCurrentPage(idx+1)}
                                >
                                    {idx+1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages} 
                            />
                        </Pagination>
                    </div>
                )}
            </Container>

        </div>
    );
};

export default Home;