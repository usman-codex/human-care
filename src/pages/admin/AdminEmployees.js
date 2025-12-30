// src/pages/admin/AdminEmployees.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout'; // <--- Sahi Path
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { FaTrash, FaUserPlus, FaPhone, FaCalendarAlt } from 'react-icons/fa';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '', position: 'Salesman', phone: '', salary: '', joining_date: ''
    });

    // 1. Data Mangwana
    const fetchEmployees = async () => {
        const res = await axios.get('http://localhost/human-care/backend/get_employees.php');
        setEmployees(res.data);
    };

    useEffect(() => { fetchEmployees(); }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    // 2. Add Employee
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost/human-care/backend/add_employee.php', formData);
            if(res.data.success) {
                alert("Employee Added!");
                setShowModal(false);
                fetchEmployees();
                setFormData({ name: '', position: 'Salesman', phone: '', salary: '', joining_date: '' });
            }
        } catch(err) { alert("Server Error"); }
    };

    // 3. Delete Employee
    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to remove this employee?")) {
            await axios.post('http://localhost/human-care/backend/delete_employee.php', { id });
            fetchEmployees();
        }
    };

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Employees Management</h3>
                <Button variant="success" onClick={() => setShowModal(true)}>
                    <FaUserPlus className="me-2"/> Add New Employee
                </Button>
            </div>

            <div className="bg-white p-3 shadow-sm rounded">
                <Table hover responsive>
                    <thead className="bg-light">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Phone</th>
                            <th>Salary</th>
                            <th>Joining Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp, index) => (
                            <tr key={emp.id} style={{verticalAlign:'middle'}}>
                                <td>{index + 1}</td>
                                <td className="fw-bold">{emp.name}</td>
                                <td>
                                    <Badge bg="info">{emp.position}</Badge>
                                </td>
                                <td><FaPhone size={12} className="me-1"/> {emp.phone}</td>
                                <td className="text-success fw-bold">Rs. {emp.salary}</td>
                                <td><FaCalendarAlt size={12} className="me-1"/> {emp.joining_date}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(emp.id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* --- ADD EMPLOYEE MODAL --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control name="name" onChange={handleChange} required placeholder="Ali Ahmed" />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Position</Form.Label>
                                    <Form.Select name="position" onChange={handleChange}>
                                        <option value="Salesman">Salesman</option>
                                        <option value="Pharmacist">Pharmacist</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Helper">Helper</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control name="phone" onChange={handleChange} required placeholder="0300-1234567" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Salary (Rs)</Form.Label>
                                    <Form.Control type="number" name="salary" onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Joining Date</Form.Label>
                                    <Form.Control type="date" name="joining_date" onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit" className="w-100">Save Employee</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </DashboardLayout>
    );
};

export default AdminEmployees;