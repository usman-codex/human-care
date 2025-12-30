// src/pages/admin/AdminProducts.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { FaTrash, FaPlus, FaEdit, FaUpload } from 'react-icons/fa';

const categoriesList = ["Tablets", "Syrup", "Injection", "Capsules", "Drops", "Ointment/Cream", "Sachet", "Suspension", "Gel", "Inhaler", "Drip/IV", "Surgical"];
const genericsList = ["Paracetamol", "Ibuprofen", "Omeprazole", "Amoxicillin", "Ciprofloxacin", "Metformin", "Atorvastatin", "Aspirin", "Azithromycin", "Cetirizine"];

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', category: 'Tablets', section: 'featured', price: '', old_price: '', 
        stock: '10', description: '', generic_name: '', manufacturer: '',
        strips_per_pack: '1', tablets_per_strip: '10', discount: '0'
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost/human-care/backend/get_products.php');
            setProducts(res.data);
        } catch (error) { console.error("Error fetching products"); }
    };

    useEffect(() => { fetchProducts(); }, []);

    // --- AUTO CALCULATE DISCOUNT ---
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        
        let newFormData = { ...formData, [name]: value };

        // Agar Price ya Old Price change ho raha hai, to Discount calculate karo
        if (name === 'price' || name === 'old_price') {
            const price = parseFloat(name === 'price' ? value : formData.price) || 0;
            const oldPrice = parseFloat(name === 'old_price' ? value : formData.old_price) || 0;

            if (oldPrice > price) {
                const discountVal = ((oldPrice - price) / oldPrice) * 100;
                newFormData.discount = Math.round(discountVal); // Round Figure
            } else {
                newFormData.discount = 0; // No Discount
            }
        }
        
        setFormData(newFormData);
    };

    const handleFileChange = (e) => setImageFile(e.target.files[0]);

    const handleModalOpen = (product = null) => {
        if (product) {
            setEditMode(true);
            setEditProductId(product.id);
            setFormData(product);
        } else {
            setEditMode(false);
            setEditProductId(null);
            setFormData({
                name: '', category: 'Tablets', section: 'featured', price: '', old_price: '', 
                stock: '10', description: '', generic_name: '', manufacturer: '',
                strips_per_pack: '1', tablets_per_strip: '10', discount: '0'
            });
        }
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);
        if (editMode) data.append('id', editProductId);

        let url = editMode 
            ? 'http://localhost/human-care/backend/update_product.php'
            : 'http://localhost/human-care/backend/add_product.php';

        try {
            const res = await axios.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            if(res.data.success) {
                alert(res.data.message);
                setShowModal(false);
                fetchProducts();
            } else { alert("Error: " + res.data.message); }
        } catch(err) { alert("Server Error!"); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete?")) {
            await axios.post('http://localhost/human-care/backend/delete_product.php', { id });
            fetchProducts();
        }
    };

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Medicines Inventory</h3>
                <Button variant="primary" onClick={() => handleModalOpen(null)}><FaPlus className="me-2"/> Add New Medicine</Button>
            </div>

            <div className="bg-white p-3 shadow-sm rounded">
                <Table hover responsive>
                    <thead className="bg-light">
                        <tr>
                            <th>Image</th><th>Name</th><th>Category</th><th>Generic</th><th>Price</th><th>Discount</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item.id} style={{verticalAlign:'middle'}}>
                                <td><img src={item.image} width="40" style={{borderRadius:'5px'}} alt=""/></td>
                                <td className="fw-bold">{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.generic_name}</td>
                                <td>Rs. {item.price}</td>
                                <td>{item.discount > 0 ? <Badge bg="danger">{item.discount}% OFF</Badge> : '-'}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => handleModalOpen(item)}><FaEdit /></Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}><FaTrash /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>{editMode ? "Edit Medicine" : "Add New Medicine"}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Name</Form.Label>
                                <Form.Control name="name" value={formData.name} onChange={handlePriceChange} required /></Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Category</Form.Label>
                                <Form.Select name="category" value={formData.category} onChange={handlePriceChange}>
                                    {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Generic Name</Form.Label>
                                <Form.Control list="generics" name="generic_name" value={formData.generic_name} onChange={handlePriceChange} />
                                <datalist id="generics">{genericsList.map((gen, index) => <option key={index} value={gen} />)}</datalist>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Manufacturer</Form.Label>
                                <Form.Control name="manufacturer" value={formData.manufacturer} onChange={handlePriceChange} /></Form.Group>
                            </Col>
                        </Row>

                        <Row className="bg-light p-2 mb-3 rounded border">
                            <Col md={12}><h6 className="text-primary fw-bold">Pack & Price Calculation</h6></Col>
                            
                            <Col md={4}>
                                <Form.Group className="mb-3"><Form.Label>Price (Sale Price)</Form.Label>
                                <Form.Control type="number" name="price" value={formData.price} onChange={handlePriceChange} required /></Form.Group>
                            </Col>
                            
                            <Col md={4}>
                                <Form.Group className="mb-3"><Form.Label>Old Price (MRP)</Form.Label>
                                <Form.Control type="number" name="old_price" value={formData.old_price} onChange={handlePriceChange} /></Form.Group>
                            </Col>
                            
                            {/* DISCOUNT FIELD (READ ONLY - Auto Calculate Hoga) */}
                            <Col md={4}>
                                <Form.Group className="mb-3"><Form.Label>Auto Discount %</Form.Label>
                                <Form.Control type="number" name="discount" value={formData.discount} readOnly style={{background:'#e9ecef'}} /></Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Strips in 1 Pack</Form.Label>
                                <Form.Control type="number" name="strips_per_pack" value={formData.strips_per_pack} onChange={handlePriceChange} /></Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Tablets in 1 Strip</Form.Label>
                                <Form.Control type="number" name="tablets_per_strip" value={formData.tablets_per_strip} onChange={handlePriceChange} /></Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Section</Form.Label>
                                <Form.Select name="section" value={formData.section} onChange={handlePriceChange}>
                                    <option value="featured">Featured Medicines</option>
                                    <option value="devices">Devices</option>
                                    <option value="family">Family Care</option>
                                    <option value="herbal">Herbal</option>
                                </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Upload Image</Form.Label><Form.Control type="file" onChange={handleFileChange} /></Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3"><Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handlePriceChange} /></Form.Group>

                        <Button type="submit" className="w-100 btn-primary fw-bold">Save Medicine</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminProducts;