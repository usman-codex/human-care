// src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout'; // Sahi Path
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { FaPills, FaExclamationTriangle, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
    
    // State to store Real Data
    const [stats, setStats] = useState({
        total_products: 0,
        low_stock: 0,
        total_employees: 0,
        total_sales: 0
    });

    // Database se Count Mangwana
    useEffect(() => {
        axios.get('http://localhost/human-care/backend/dashboard_stats.php')
            .then(res => {
                setStats(res.data);
            })
            .catch(err => console.error("Error fetching stats"));
    }, []);

    // Cards Data Structure
    const cards = [
        { 
            title: "TOTAL MEDICINES", 
            value: stats.total_products, 
            color: "#4e73df", 
            icon: <FaPills size={24} style={{opacity:0.5}} /> 
        },
        { 
            title: "LOW STOCK ITEMS", 
            value: stats.low_stock, 
            color: "#e74a3b", 
            icon: <FaExclamationTriangle size={24} style={{opacity:0.5}} /> 
        },
        { 
            title: "TOTAL EMPLOYEES", 
            value: stats.total_employees, 
            color: "#1cc88a", 
            icon: <FaUsers size={24} style={{opacity:0.5}} /> 
        },
        { 
            title: "TODAY'S SALES", 
            value: `Rs. ${stats.total_sales}`, 
            color: "#f6c23e", 
            icon: <FaMoneyBillWave size={24} style={{opacity:0.5}} /> 
        },
    ];

    return (
        <DashboardLayout>
            <h3 className="mb-4">Dashboard Overview</h3>
            
            <Row>
                {cards.map((item, index) => (
                    <Col md={3} key={index} className="mb-4">
                        <Card className="shadow-sm border-0 h-100 py-2" style={{borderLeft: `5px solid ${item.color}`}}>
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

            {/* Recent Activity Section */}
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white fw-bold py-3">
                            📢 System Status
                        </Card.Header>
                        <Card.Body>
                            <p>
                                Currently, you have <strong>{stats.total_products}</strong> medicines in your inventory.
                                <br />
                                <span className={stats.low_stock > 0 ? "text-danger fw-bold" : "text-success"}>
                                    {stats.low_stock > 0 
                                        ? `⚠️ Warning: ${stats.low_stock} items are running low on stock!` 
                                        : "✅ All stock levels are good."}
                                </span>
                            </p>
                            <p>
                                Total Active Employees: <strong>{stats.total_employees}</strong>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </DashboardLayout>
    );
};

export default AdminDashboard;