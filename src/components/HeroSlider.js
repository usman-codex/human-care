import React from 'react';
import { Carousel, Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const HeroSlider = () => {
    
    const textAnimation = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <Container className="mt-4 mb-5">
            <Carousel 
                interval={3500} 
                pause={false} 
                indicators={true}
                controls={false} 
                className="hero-carousel shadow-sm"
                style={{ borderRadius: '20px', overflow: 'hidden' }}
            >
                
                <Carousel.Item style={{ backgroundColor: '#eef7ff', height: '400px' }}>
                    <Row className="h-100 align-items-center">
                        <Col md={7} className="ps-5">
                            <motion.div initial="hidden" whileInView="visible" variants={textAnimation}>
                                <h5 className="text-dark mb-2" style={{fontWeight:'400'}}>Human Care Se Milay Gi</h5>
                                
                                <h1 className="display-4 fw-bold" style={{color:'#2761e7'}}>
                                    100% Genuine Dawaai..
                                </h1>
                                <h1 className="display-4 fw-bold mb-3" style={{color:'#2761e7'}}>
                                    Ab Ghar Bethey!
                                </h1>
                                
                                <h5 className="text-dark mb-4">Order Your Medicines Now! & Avail</h5>
                                
                                <div style={{
                                    backgroundColor: '#e57373', color: 'white', padding: '10px 20px', 
                                    borderRadius: '5px', display: 'inline-block', fontWeight: 'bold', fontSize:'18px'
                                }}>
                                    Upto 10% OFF
                                </div>
                            </motion.div>
                        </Col>
                        
                        <Col md={5} className="h-100 d-flex align-items-end justify-content-end overflow-hidden">
                            <img 
                               src={require('../assets/pharmacy-slider-img-1.jpg')}
                                alt="Old Man" 
                                style={{ height: '90%', objectFit: 'contain' }} 
                            />
                        </Col>
                    </Row>
                </Carousel.Item>

                <Carousel.Item style={{ backgroundColor: '#a5d6a7', height: '400px' }}>
                    <div style={{
                        width: '100%', height: '100%', 
                        background: 'linear-gradient(90deg, #81c784 0%, #a5d6a7 100%)',
                        display: 'flex', alignItems: 'center'
                    }}>
                        <Container>
                            <Row className="align-items-center">
                                <Col md={6} className="ps-5">
                                    <motion.div initial="hidden" whileInView="visible" variants={textAnimation}>
                                        <div style={{
                                            background: '#4caf50', color: 'white', padding: '5px 15px', 
                                            borderRadius: '5px', display: 'inline-block', marginBottom: '15px'
                                        }}>
                                            Exclusive Offer
                                        </div>
                                        
                                        <h3 className="text-white fw-light mb-0">Flat</h3>
                                        <h1 className="fw-bold text-white display-2 mb-3">10% OFF</h1>
                                        
                                        <div style={{
                                            backgroundColor: '#d87a61', color: 'white', padding: '10px 25px', 
                                            borderRadius: '8px', display: 'inline-block', fontWeight: 'bold', fontSize:'22px'
                                        }}>
                                            On Featured Medicines*
                                        </div>
                                    </motion.div>
                                </Col>
                                <Col md={6}>
                                    <img 
                                        src={require('../assets/pharmacy-slider-img-2.jpg')}
                                        style={{ width: '100%', mixBlendMode: 'multiply', opacity: 0.8 }} 
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Carousel.Item>

            </Carousel>
        </Container>
    );
};

export default HeroSlider;
