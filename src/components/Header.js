// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, Form, Button, Nav } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaChevronDown, FaHeartbeat } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const Header = ({ cartCount, openCart, user, setUser, triggerLogin }) => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Auth Modal State
    const [showAuthModal, setShowAuthModal] = useState(false);

    // App.js se agar signal aye to login kholo
    useEffect(() => {
        if (triggerLogin) setShowAuthModal(true);
    }, [triggerLogin]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setShowProfileMenu(false);
        navigate('/');
    };

    const handleLoginSuccess = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setShowAuthModal(false);
    };

    return (
        <>
            {/* --- TOP HEADER (Logo, Search, Icons) --- */}
            <div className="top-header">
                <Container>
                    <Row className="align-items-center">
                        {/* 1. LOGO */}
                        <Col xs={6} md={3}>
                            <Link to="/" className="brand-logo">
                                <FaHeartbeat size={35} color="#2761e7" style={{marginRight:'8px'}} />
                                <div>Human<span>Care</span></div>
                            </Link>
                        </Col>

                        {/* 2. SEARCH BAR */}
                        <Col md={5} className="d-none d-md-block">
                            <InputGroup>
                                <Form.Control
                                    placeholder="Search for medicines, products..."
                                    className="custom-search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button className="custom-search-btn">
                                    <FaSearch />
                                </Button>
                            </InputGroup>
                        </Col>

                        {/* 3. ICONS & LOGIN */}
                        <Col xs={6} md={4} className="d-flex justify-content-end align-items-center">
                            
                            {/* Cart Icon */}
                            <div className="cart-icon-box me-3" onClick={openCart}>
                                <FaShoppingCart />
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </div>

                            {/* User Logic */}
                            {user ? (
                                <div style={{position:'relative'}}>
                                    <div 
                                        className="user-profile-icon" 
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    >
                                        <FaUser />
                                    </div>
                                    
                                    <AnimatePresence>
                                        {showProfileMenu && (
                                            // ... baki code ...

// Dropdown Menu
<motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="profile-menu">
    <div className="profile-header">{user.name}</div>
    <div className="profile-list">
        <Link to="/my-orders" onClick={()=>setShowProfileMenu(false)}>My Orders</Link>
        
        {/* YE LINE ADD KAREIN */}
        <Link to="/upload-prescription" onClick={()=>setShowProfileMenu(false)}>Upload Prescription</Link>
        
        <div onClick={handleLogout} className="text-danger p-2" style={{cursor:'pointer'}}>Sign Out</div>
    </div>
</motion.div>

// ... baki code ...
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Button 
                                    className="login-btn d-none d-md-block"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    Sign Up | Sign In
                                </Button>
                            )}

                            {/* Mobile Toggle */}
                            <FaBars 
                                className="d-md-none ms-3" 
                                size={24} 
                                color="#333" 
                                style={{cursor:'pointer'}}
                                onClick={() => setMobileMenuOpen(true)}
                            />
                        </Col>
                    </Row>
                    
                    {/* Mobile Search */}
                    <div className="d-md-none mt-3">
                         <InputGroup>
                            <Form.Control
                                placeholder="Search medicine..."
                                className="custom-search-input"
                                value={searchTerm}
                            />
                            <Button className="custom-search-btn"><FaSearch/></Button>
                        </InputGroup>
                    </div>
                </Container>
            </div>

            {/* --- NAVIGATION BAR (YE MISSING THA, AB WAPIS AA GAYA) --- */}
            <div className="main-navbar d-none d-md-block">
                <Container>
                    <div className="custom-nav-container">
                        <Link to="/" className="nav-link-custom">Homepage</Link>
                        
                        {/* Dropdown: Medications */}
                        <div className="nav-item-custom">
                            <span>Medications <FaChevronDown size={10} style={{marginLeft:'5px'}}/></span>
                            <div className="custom-dropdown-menu">
                                <Link to="#" className="dropdown-item-custom">Tablets</Link>
                                <Link to="#" className="dropdown-item-custom">Syrups</Link>
                                <Link to="#" className="dropdown-item-custom">Injections</Link>
                            </div>
                        </div>

                        {/* Dropdown: Wellness */}
                        <div className="nav-item-custom">
                            <span>Wellness & Beauty <FaChevronDown size={10} style={{marginLeft:'5px'}}/></span>
                            <div className="custom-dropdown-menu">
                                <Link to="#" className="dropdown-item-custom">Skin Care</Link>
                                <Link to="#" className="dropdown-item-custom">Vitamins</Link>
                            </div>
                        </div>

                         {/* Dropdown: Devices */}
                         <div className="nav-item-custom">
                            <span>Devices & Injectables <FaChevronDown size={10} style={{marginLeft:'5px'}}/></span>
                            <div className="custom-dropdown-menu">
                                <Link to="#" className="dropdown-item-custom">BP Monitors</Link>
                                <Link to="#" className="dropdown-item-custom">Glucometers</Link>
                            </div>
                        </div>

                       
<div className="d-flex align-items-center">
    <Link to="/contact" className="nav-link-custom">Contact Us</Link>
    
    {/* YE BHI ADD KAR SKTE HAIN */}
    <Link to="/upload-prescription" className="text-decoration-none ms-3 fw-bold text-primary">
        Upload Your Prescription
    </Link>
</div>
                    </div>
                </Container>
            </div>

            {/* --- MOBILE SIDEBAR DRAWER --- */}
            <div className={`overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
            <div className={`mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0 text-primary">Menu</h4>
                    <FaTimes size={24} style={{cursor:'pointer'}} onClick={() => setMobileMenuOpen(false)}/>
                </div>

                {!user && (
                    <Button className="w-100 mb-3 btn-primary" onClick={() => {setMobileMenuOpen(false); setShowAuthModal(true);}}>Login / Sign Up</Button>
                )}

                <Nav className="flex-column">
                    <Link to="/" className="nav-link text-dark border-bottom py-3">Homepage</Link>
                    <div className="py-3 border-bottom text-dark fw-bold">Medications</div>
                    <div className="ps-3">
                         <Link to="#" className="nav-link text-secondary py-2">Tablets</Link>
                         <Link to="#" className="nav-link text-secondary py-2">Syrups</Link>
                    </div>
                    <div className="py-3 border-bottom text-dark fw-bold">Wellness</div>
                </Nav>
            </div>

            {/* --- AUTH MODAL --- */}
            <AuthModal 
                show={showAuthModal} 
                handleClose={() => setShowAuthModal(false)}
                handleLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default Header;