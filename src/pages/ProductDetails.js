// src/pages/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Card, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaTruck, FaMinus, FaPlus } from 'react-icons/fa';

const ProductDetails = ({ cart, addToCart, decreaseQty }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState('pack'); 
    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        axios.get('http://localhost/human-care/backend/get_products.php').then(res => {
            const found = res.data.find(p => p.id == id);
            setProduct(found);
        });
    }, [id]);

    useEffect(() => {
        if (product) {
            const found = cart.find(item => item.id === product.id && item.unit === selectedUnit);
            setCartItem(found);
        }
    }, [cart, product, selectedUnit]);

    if (!product) return <div className="text-center mt-5">Loading...</div>;

    const discountPercent = parseFloat(product.discount) || 0;
    const packPrice = parseFloat(product.price);
    const oldPackPrice = parseFloat(product.old_price) || 0;
    const stripsPerPack = parseInt(product.strips_per_pack) || 1;
    const tabletsPerStrip = parseInt(product.tablets_per_strip) || 10;
    const stripPrice = packPrice / stripsPerPack;
    const oldStripPrice = oldPackPrice / stripsPerPack;
    const showPrice = selectedUnit === 'pack' ? packPrice : stripPrice;
    const showOldPrice = selectedUnit === 'pack' ? oldPackPrice : oldStripPrice;

    const handleAdd = () => {
        const itemToAdd = {
            ...product,
            unit: selectedUnit,
            price: Math.round(showPrice),
            name: `${product.name} (${selectedUnit === 'pack' ? 'Pack' : 'Strip'})`
        };
        addToCart(itemToAdd);
    };

    return (
        <Container className="mt-5 mb-5">
            {/* TOP SECTION: IMAGE AND PRICE */}
            <Row className="mb-5">
                {/* LEFT: Image */}
                <Col md={5}>
                    <div className="p-4 border rounded shadow-sm bg-white text-center">
                        <img src={product.image} alt={product.name} className="img-fluid" style={{maxHeight:'350px'}} />
                    </div>
                </Col>

                {/* RIGHT: Product Info & Actions */}
                <Col md={7}>
                    <h2 className="fw-bold text-primary">{product.name}</h2>
                    <div className="mb-2">
                        <Badge bg="success" className="me-2">In Stock</Badge>
                        <span className="text-muted">Generic: <strong>{product.generic_name}</strong></span>
                    </div>
                    <h6 className="text-muted mb-3">Manufacturer: {product.manufacturer}</h6>

                    <div className="d-flex align-items-center mb-4">
                        <h1 className="fw-bold me-3 text-dark">Rs. {Math.round(showPrice)}</h1>
                        {discountPercent > 0 && showOldPrice > showPrice && (
                            <>
                                <span className="text-decoration-line-through text-muted fs-5">Rs. {Math.round(showOldPrice)}</span>
                                <Badge bg="danger" className="ms-3 p-2">{discountPercent}% OFF</Badge>
                            </>
                        )}
                    </div>

                    <Card className="mb-4 bg-light border-0">
                        <Card.Body>
                            <h6 className="fw-bold mb-3">Select Pack Size:</h6>
                            <Form.Check 
                                type="radio" id="pack-opt" name="unit-select"
                                label={`1 Pack = ${stripsPerPack} Strips`}
                                checked={selectedUnit === 'pack'}
                                onChange={() => setSelectedUnit('pack')}
                                className="mb-2 custom-radio"
                            />
                            <Form.Check 
                                type="radio" id="strip-opt" name="unit-select"
                                label={`1 Strip = ${tabletsPerStrip} Tablets`}
                                checked={selectedUnit === 'strip'}
                                onChange={() => setSelectedUnit('strip')}
                                className="custom-radio"
                            />
                        </Card.Body>
                    </Card>

                    <div className="d-flex gap-3">
                        {cartItem ? (
                            <div className="d-flex align-items-center bg-primary text-white rounded overflow-hidden" style={{width:'150px'}}>
                                <Button variant="primary" className="rounded-0 px-3" onClick={() => decreaseQty(cartItem)}><FaMinus size={12}/></Button>
                                <span className="flex-grow-1 text-center fw-bold">{cartItem.qty}</span>
                                <Button variant="primary" className="rounded-0 px-3" onClick={() => addToCart(cartItem)}><FaPlus size={12}/></Button>
                            </div>
                        ) : (
                            <Button variant="primary" size="lg" className="w-50 shadow" onClick={handleAdd}>
                                <FaShoppingCart className="me-2"/> Add To Cart
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {/* BOTTOM SECTION: FULL WIDTH DESCRIPTION */}
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white fw-bold py-3 fs-5">Description</Card.Header>
                        <Card.Body>
                            <p className="text-muted" style={{lineHeight:'1.8'}}>
                                {product.description || "No description available for this product."}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default ProductDetails;