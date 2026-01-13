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
            const res = await axios.get('http://humancare.mywebcommunity.org/backend/get_prescriptions.php');
            if (Array.isArray(res.data)) {
                setList(res.data);
            } else {
                setList([]);
            }
        } catch (err) { 
            console.error("Error fetching prescriptions"); 
            setList([]);
        }
    };

    useEffect(() => { fetchList(); }, []);

    const handleStatus = async (id, status) => {
        try {
            await axios.post('http://humancare.mywebcommunity.org/backend/update_prescription_status.php', { id, status });
            fetchList();
        } catch (error) {
            alert("Error updating status");
        }
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
                        {Array.isArray(list) && list.length > 0 ? (
                            list.map((item) => (
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
                                            <FaEye className="me-1"/> View Image
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">No prescription requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title>Prescription Slip</Modal.Title></Modal.Header>
                <Modal.Body className="text-center">
                    {selected && (
                        <>
                            <div className="bg-light p-3 rounded mb-3 text-start">
                                <p className="mb-1"><strong>Patient Name:</strong> {selected.customer_name}</p>
                                <p className="mb-0"><strong>Phone:</strong> {selected.phone}</p>
                            </div>
                            
                            <img src={selected.image_path} alt="Slip" className="img-fluid rounded mb-3 border" style={{maxHeight:'500px'}} />
                            
                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                                {selected.status !== 'Reviewed' && (
                                    <Button variant="success" onClick={() => { handleStatus(selected.id, 'Reviewed'); setShowModal(false); }}>
                                        <FaCheckDouble className="me-2"/> Mark as Reviewed
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminPrescriptions;
