import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Row, Col, Card, Modal, Table, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { FaPills, FaExclamationTriangle, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
    
    const [stats, setStats] = useState({
        total_products: 0,
        low_stock: 0,
        total_employees: 0,
        total_sales: 0
    });

    const [showModal, setShowModal] = useState(false);
    const [lowStockList, setLowStockList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost/human-care/backend/dashboard_stats.php')
            .then(res => setStats(res.data))
            .catch(err => console.error("Error fetching stats"));
    }, []);

    const handleLowStockClick = async () => {
        try {
            const res = await axios.get('http://localhost/human-care/backend/get_products.php');
            const lowItems = res.data.filter(item => parseInt(item.stock) < 5);
            setLowStockList(lowItems);
            setShowModal(true);
        } catch (error) {
            alert("Error loading list");
        }
    };

    const cards = [
        { 
            title: "TOTAL MEDICINES", 
            value: stats.total_products, 
            color: "#4e73df", 
            icon: <FaPills size={24} style={{opacity:0.5}} />,
            action: null 
        },
        { 
            title: "LOW STOCK ITEMS", 
            value: stats.low_stock, 
            color: "#e74a3b", 
            icon: <FaExclamationTriangle size={24} style={{opacity:0.5}} />,
            action: handleLowStockClick,
            cursor: 'pointer' 
        },
        { 
            title: "TOTAL EMPLOYEES", 
            value: stats.total_employees, 
            color: "#1cc88a", 
            icon: <FaUsers size={24} style={{opacity:0.5}} />,
            action: null 
        },
        { 
            title: "TODAY'S SALES", 
            value: `Rs. ${stats.total_sales}`, 
            color: "#f6c23e", 
            icon: <FaMoneyBillWave size={24} style={{opacity:0.5}} />,
            action: null 
        },
    ];

    return (
        <DashboardLayout>
            <h3 className="mb-4">Dashboard Overview</h3>
            
            <Row>
                {cards.map((item, index) => (
                    <Col md={3} key={index} className="mb-4">
                        <Card 
                            className="shadow-sm border-0 h-100 py-2" 
                            style={{
                                borderLeft: `5px solid ${item.color}`, 
                                cursor: item.cursor || 'default',
                                transition: '0.3s'
                            }}
                            onClick={item.action ? item.action : undefined}
                            onMouseOver={(e) => item.action && (e.currentTarget.style.transform = 'scale(1.02)')}
                            onMouseOut={(e) => item.action && (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-xs fw-bold text-uppercase mb-1" style={{color: item.color, fontSize:'12px'}}>
                                            {item.title}
                                        </div>
                                        <div className="h3 mb-0 fw-bold text-dark">
                                            {item.value}
                                        </div>
                                    </div>
                                    <div style={{color: item.color}}>
                                        {item.icon}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger fw-bold">⚠️ Low Stock Medicines</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {lowStockList.length > 0 ? (
                        <Table hover responsive bordered>
                            <thead className="bg-light">
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockList.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img src={item.image} width="40" height="40" style={{borderRadius:'5px'}} alt=""/>
                                        </td>
                                        <td className="fw-bold">{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <Badge bg="danger" style={{fontSize:'14px'}}>
                                                {item.stock}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button size="sm" variant="outline-primary" href="/admin/products">
                                                Update Stock
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-center text-success fw-bold">All items are sufficiently stocked! ✅</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

        </DashboardLayout>
    );
};

export default AdminDashboard;
