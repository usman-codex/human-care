// src/pages/admin/AdminSales.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { FaMoneyBillWave, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const AdminSales = () => {
    const [sales, setSales] = useState({
        today: 0,
        month: 0,
        lifetime: 0,
        daily_report: []
    });

    useEffect(() => {
        axios.get('http://localhost/human-care/backend/get_sales_report.php')
            .then(res => setSales(res.data))
            .catch(err => console.error("Error fetching sales"));
    }, []);

    // Cards Data
    const cards = [
        { title: "Today's Revenue", amount: sales.today, color: "#4e73df", icon: <FaMoneyBillWave/> },
        { title: "This Month's Revenue", amount: sales.month, color: "#1cc88a", icon: <FaCalendarAlt/> },
        { title: "Lifetime Earnings", amount: sales.lifetime, color: "#f6c23e", icon: <FaChartLine/> },
    ];

    return (
        <DashboardLayout>
            <h3 className="mb-4">Financial Report & Billing</h3>

            {/* --- TOP CARDS --- */}
            <Row className="mb-4">
                {cards.map((card, index) => (
                    <Col md={4} key={index}>
                        <Card className="border-0 shadow-sm h-100 py-2" style={{borderLeft: `5px solid ${card.color}`}}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-xs fw-bold text-uppercase mb-1" style={{color: card.color}}>
                                            {card.title}
                                        </div>
                                        <div className="h3 mb-0 fw-bold text-gray-800">Rs. {parseInt(card.amount).toLocaleString()}</div>
                                    </div>
                                    <div className="text-gray-300 fs-2" style={{opacity:0.3}}>
                                        {card.icon}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* --- DAILY SALES TABLE --- */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                    <h6 className="m-0 fw-bold text-primary">Daily Sales History (Delivered Orders)</h6>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive bordered>
                        <thead className="bg-light">
                            <tr>
                                <th>Date</th>
                                <th>Total Orders Delivered</th>
                                <th>Total Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.daily_report.length > 0 ? (
                                sales.daily_report.map((row, index) => (
                                    <tr key={index}>
                                        <td>{new Date(row.date).toDateString()}</td>
                                        <td className="text-center fw-bold">{row.total_orders}</td>
                                        <td className="text-success fw-bold text-end">Rs. {parseInt(row.revenue).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">No delivered orders yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

        </DashboardLayout>
    );
};

export default AdminSales;