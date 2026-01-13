import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Table, Button, Modal, Form, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaTrash, FaPlus, FaEdit, FaSearch } from 'react-icons/fa';

const categoriesList = [
    "Tablets", "Capsules", "Syrup", "Injection", "Drops", 
    "Ointment/Cream", "Sachet", "Suspension", "Gel", "Inhaler", 
    "Drip/IV", "Surgical", "Devices", "Consumer Goods"
];

const genericsList = ["Paracetamol", "Ibuprofen", "Omeprazole", "Amoxicillin", "Ciprofloxacin", "Metformin", "Atorvastatin", "Aspirin", "Azithromycin", "Cetirizine"];

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        name: '', category: 'Tablets', section: 'featured', price: '', old_price: '', 
        stock: '10', description: '', generic_name: '', manufacturer: '',
        strips_per_pack: '1', tablets_per_strip: '10', discount: '0'
    });
    const [imageFile, setImageFile] = useState(null);

    const isStripCategory = formData.category === 'Tablets' || formData.category === 'Capsules';

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://humancare.mywebcommunity.org/backend/get_products.php');
            
            if (Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setProducts([]);
            }
        } catch (error) { console.error("Error fetching products"); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const filteredProducts = Array.isArray(products) ? products.filter((product) => {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) return true;

        const name = String(product.name || "").toLowerCase();
        const generic = String(product.generic_name || "").toLowerCase();
        
        return name.includes(term) || generic.includes(term);
    }) : [];

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === 'price' || name === 'old_price') {
            const price = parseFloat(name === 'price' ? value : formData.price) || 0;
            const oldPrice = parseFloat(name === 'old_price' ? value : formData.old_price) || 0;

            if (oldPrice > price) {
                const discountVal = ((oldPrice - price) / oldPrice) * 100;
                newFormData.discount = Math.round(discountVal);
            } else {
                newFormData.discount = 0;
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
        
        if(!isStripCategory) {
            data.set('strips_per_pack', '1');
            data.set('tablets_per_strip', '1');
        }

        if (imageFile) data.append('image', imageFile);
        if (editMode) data.append('id', editProductId);

        let url = editMode 
            ? 'http://humancare.mywebcommunity.org/backend/update_product.php'
            : 'http://humancare.mywebcommunity.org/backend/add_product.php';

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
            await axios.post('http://humancare.mywebcommunity.org/backend/delete_product.php', { id });
            fetchProducts();
        }
    };

    return (
        <DashboardLayout>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <h3 className="m-0">Medicines Inventory</h3>
                
                <InputGroup style={{ maxWidth: '400px', width: '100%' }}>
                    <InputGroup.Text className="bg-white border-end-0">
                        <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control 
                        placeholder="Search by Name or Generic..." 
                        className="border-start-0 ps-0 shadow-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>

                <Button variant="primary" style={{whiteSpace:'nowrap'}} onClick={() => handleModalOpen(null)}>
                    <FaPlus className="me-2"/> Add New Medicine
                </Button>
            </div>

            <div className="bg-white p-3 shadow-sm rounded">
                <Table hover responsive>
                    <thead className="bg-light">
                        <tr>
                            <th>Image</th><th>Name</th><th>Category</th><th>Generic</th><th>Price</th><th>Stock</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((item) => (
                                <tr key={item.id} style={{verticalAlign:'middle'}}>
                                    <td><img src={item.image} width="40" style={{borderRadius:'5px'}} alt=""/></td>
                                    <td className="fw-bold">{item.name}</td>
                                    <td>{item.category}</td>
                                    <td><small className="text-muted">{item.generic_name}</small></td>
                                    <td>Rs. {item.price}</td>
                                    <td>
                                        {item.stock < 5 ? <span className="text-danger fw-bold">{item.stock} (Low)</span> : item.stock}
                                    </td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => handleModalOpen(item)}><FaEdit /></Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}><FaTrash /></Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-muted">
                                    {products.length === 0 ? "Loading or No Data..." : `No match for "${searchTerm}"`}
                                </td>
                            </tr>
                        )}
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
                            <Col md={12}><h6 className="text-primary fw-bold">Price & Stock</h6></Col>
                            <Col md={4}>
                                <Form.Group className="mb-3"><Form.Label>Price</Form.Label>
                                <Form.Control type="number" name="price" value={formData.price} onChange={handlePriceChange} required /></Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3"><Form.Label>Old Price</Form.Label>
                                <Form.Control type="number" name="old_price" value={formData.old_price} onChange={handlePriceChange} /></Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3"><Form.Label>Discount %</Form.Label>
                                <Form.Control type="number" name="discount" value={formData.discount} readOnly style={{background:'#e9ecef'}} /></Form.Group>
                            </Col>

                            {isStripCategory && (
                                <>
                                    <Col md={12} className="mt-2"><div className="border-top mb-2"></div><small className="text-muted fw-bold">Tablets/Capsules Only:</small></Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3"><Form.Label>Strips in 1 Pack</Form.Label>
                                        <Form.Control type="number" name="strips_per_pack" value={formData.strips_per_pack} onChange={handlePriceChange} /></Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3"><Form.Label>Tablets in 1 Strip</Form.Label>
                                        <Form.Control type="number" name="tablets_per_strip" value={formData.tablets_per_strip} onChange={handlePriceChange} /></Form.Group>
                                    </Col>
                                </>
                            )}
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Section</Form.Label>
                                <Form.Select name="section" value={formData.section} onChange={handlePriceChange}>
                                    <option value="featured">Featured Medicines</option>
                                    <option value="devices">Devices</option>
                                    <option value="family">Family Care</option>
                                    <option value="herbal">Herbal</option>
                                    <option value="cosmetics">Cosmetics</option>
                                    <option value="wellness">Wellness</option>
                                    <option value="sexual">Sexual Health</option>
                                </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3"><Form.Label>Stock Quantity</Form.Label><Form.Control type="number" name="stock" value={formData.stock} onChange={handlePriceChange} /></Form.Group>
                            </Col>
                            <Col md={12}>
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
