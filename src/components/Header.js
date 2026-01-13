import React, { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, Form, Button, Nav } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaChevronDown, FaHeartbeat, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthModal from './AuthModal';

const Header = ({ cartCount, openCart, user, setUser, triggerLogin }) => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        if (triggerLogin) setShowAuthModal(true);
    }, [triggerLogin]);

    useEffect(() => {
        axios.get('http://localhost/human-care/backend/get_products.php')
            .then(res => setAllProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const results = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.generic_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [searchTerm, allProducts]);

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
            <div className="top-header">
                <Container>
                    <Row className="align-items-center">
                        <Col xs={6} md={3}>
                            <Link to="/" className="brand-logo">
                                <FaHeartbeat size={35} color="#2761e7" style={{marginRight:'8px'}} />
                                <div>Human<span>Care</span></div>
                            </Link>
                        </Col>

                        <Col md={5} className="d-none d-md-block position-relative">
                            <InputGroup>
                                <Form.Control
                                    placeholder="Search for medicines..."
                                    className="custom-search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
                                />
                                <Button className="custom-search-btn"><FaSearch /></Button>
                            </InputGroup>

                            {showDropdown && (
                                <div className="search-dropdown shadow-lg">
                                    {searchResults.length > 0 ? (
                                        searchResults.slice(0, 5).map(product => (
                                            <Link 
                                                to={`/product/${product.id}`} 
                                                key={product.id} 
                                                className="search-item d-flex align-items-center p-2 border-bottom text-decoration-none text-dark"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <img src={product.image} alt={product.name} width="50" height="50" className="rounded me-3 object-fit-contain" />
                                                <div className="flex-grow-1">
                                                    <h6 className="m-0 fw-bold">{product.name}</h6>
                                                    <small className="text-muted">{product.generic_name}</small>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-bold text-primary">Rs. {product.price}</div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-muted">
                                            <small>🚫 Medicine Not Available</small>
                                            <div className="fw-bold text-primary mt-1">Coming Soon!</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Col>

                        <Col xs={6} md={4} className="d-flex justify-content-end align-items-center">
                            <div className="cart-icon-box me-3" onClick={openCart}>
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </div>

                            {user ? (
                                <div style={{position:'relative'}}>
                                    <div className="user-profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                        <FaUser />
                                    </div>
                                    <AnimatePresence>
                                        {showProfileMenu && (
                                            <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="profile-menu">
                                                <div className="profile-header">{user.name}</div>
                                                <div className="profile-list">
                                                    <Link to="/my-orders" onClick={()=>setShowProfileMenu(false)}>My Orders</Link>
                                                    <Link to="/upload-prescription" onClick={()=>setShowProfileMenu(false)}>Upload Prescription</Link>
                                                    <div onClick={handleLogout} className="text-danger p-2" style={{cursor:'pointer'}}>Sign Out</div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Button className="login-btn d-none d-md-block" onClick={() => setShowAuthModal(true)}>
                                    Sign Up | Sign In
                                </Button>
                            )}
                            <FaBars className="d-md-none ms-3" onClick={() => setMobileMenuOpen(true)}/>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="main-navbar d-none d-md-block">
                <Container>
                    <div className="custom-nav-container d-flex align-items-center">
                        <Link to="/" className="nav-link-custom me-3">Homepage</Link>
                        
                        <div className="nav-item-custom me-3">
                            <span>Medications <FaChevronDown size={10} style={{marginLeft:'5px'}}/></span>
                            <div className="custom-dropdown-menu">
                                <Link to="#" className="dropdown-item-custom">Tablets</Link>
                                <Link to="#" className="dropdown-item-custom">Syrups</Link>
                            </div>
                        </div>

                        <div className="nav-item-custom me-3">
                            <span>Wellness & Beauty <FaChevronDown size={10} style={{marginLeft:'5px'}}/></span>
                            <div className="custom-dropdown-menu">
                                <Link to="#" className="dropdown-item-custom">Skin Care</Link>
                                <Link to="#" className="dropdown-item-custom">Vitamins</Link>
                            </div>
                        </div>

                         <div className="nav-item-custom me-3">
                            <span>Devices <FaChevronDown size={10} style={{marginLeft:'5px'}}/></span>
                            <div className="custom-dropdown-menu">
                                <Link to="#" className="dropdown-item-custom">BP Monitors</Link>
                            </div>
                        </div>

                        <div className="ms-auto d-flex align-items-center">
                            <Link to="/contact" className="nav-link-custom me-3">Contact Us</Link>
                            <Link to="/upload-prescription" className="text-decoration-none fw-bold text-primary bg-light px-3 py-2 rounded-pill shadow-sm">
                                Upload Prescription
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>

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
                </Nav>
            </div>

            <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} handleLoginSuccess={handleLoginSuccess} />
        </>
    );
};

export default Header;
