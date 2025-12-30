// src/pages/admin/AdminPrescriptions.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Table, Badge, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaEye, FaCheckDouble } from 'react-icons/fa';

const AdminPrescriptions = () => {
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchList = async () => {
        try {
            const res = await axios.get('http://localhost/human-care/backend/get_prescriptions.php');
            setList(res.data);
        } catch (err) { console.error("Error"); }
    };

    useEffect(() => { fetchList(); }, []);

    const handleStatus = async (id, status) => {
        await axios.post('http://localhost/human-care/backend/update_prescription_status.php', { id, status });
        fetchList();
    };

    return (
        <DashboardLayout>
            <h3 className="mb-4">Prescription Requests</h3>
            <div className="bg-white p-3 shadow-sm rounded">
                <Table hover responsive>
                    <thead className="bg-light">
                        <tr>
                            <th>ID</th><th>Name</th><th>Phone</th><th>Status</th><th>Date</th><th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item.id} style={{verticalAlign:'middle'}}>
                                <td>#{item.id}</td>
                                <td className="fw-bold">{item.customer_name}</td>
                                <td>{item.phone}</td>
                                <td>
                                    <Badge bg={item.status === 'Pending' ? 'warning' : 'success'}>{item.status}</Badge>
                                </td>
                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                <td>
                                    <Button size="sm" variant="outline-primary" onClick={() => {setSelected(item); setShowModal(true);}}>
                                        <FaEye/> View Image
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* IMAGE MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title>Prescription Slip</Modal.Title></Modal.Header>
                <Modal.Body className="text-center">
                    {selected && (
                        <>
                            <img src={selected.image_path} alt="Slip" className="img-fluid rounded mb-3" style={{maxHeight:'500px'}} />
                            <div className="d-flex justify-content-center gap-3">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                                <Button variant="success" onClick={() => { handleStatus(selected.id, 'Reviewed'); setShowModal(false); }}>
                                    <FaCheckDouble className="me-2"/> Mark as Reviewed
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminPrescriptions;