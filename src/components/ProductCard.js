import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
    
    const strips = parseInt(product.strips_per_pack) || 1;
    const stripPrice = product.price / strips;
    const oldStripPrice = product.old_price / strips;

    return (
        <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
            className="h-100"
        >
            <Card className="border-0 shadow-hover h-100" style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', transition: 'all 0.3s ease' }}>
                
                {product.discount > 0 && (
                    <div style={{
                        position: 'absolute', top: '10px', left: '10px', 
                        background: '#ff3b30', color: 'white', padding: '2px 8px', 
                        borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', zIndex: 10
                    }}>
                        {product.discount}% OFF
                    </div>
                )}

                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display:'block' }}>
                    <div className="text-center p-3" style={{height: '180px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f9fa'}}>
                        <img 
                            src={product.image || "https://placehold.co/200x200?text=No+Image"} 
                            alt={product.name} 
                            style={{ maxHeight: '140px', maxWidth: '100%', objectFit:'contain' }} 
                        />
                    </div>

                    <Card.Body className="d-flex flex-column pb-0">
                        <div className="text-muted small mb-1">{product.category}</div>
                        
                        <Card.Title style={{ 
                            fontSize: '15px', fontWeight: '600', 
                            height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' 
                        }}>
                            {product.name}
                        </Card.Title>
                        
                        <div className="mt-auto d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="text-primary fw-bold" style={{ fontSize: '18px' }}>
                                    Rs. {Math.round(stripPrice)}
                                </span>
                                
                                {product.discount > 0 && product.old_price > product.price && (
                                    <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '12px' }}>
                                        Rs. {Math.round(oldStripPrice)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Card.Body>
                </Link>

                <Card.Body className="pt-0">
                    <div className="d-grid gap-2">
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="d-flex align-items-center justify-content-center fw-bold rounded-pill"
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart({...product, unit: 'pack'}); 
                            }}
                        >
                            <FaShoppingCart className="me-2" /> Add to Cart
                        </Button>
                    </div>
                </Card.Body>

            </Card>
        </motion.div>
    );
};

export default ProductCard;
