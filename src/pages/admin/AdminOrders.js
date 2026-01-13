import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaEye, FaSearch, FaPrint } from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState("");
    
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [statusToUpdate, setStatusToUpdate] = useState("");
    const [rejectReason, setRejectReason] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://humancare.mywebcommunity.org/backend/get_orders.php');
            setOrders(res.data);
            setFilteredOrders(res.data);
        } catch (err) { console.error("Error"); }
    };

    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => {
        const result = orders.filter(o => 
            o.customer_name.toLowerCase().includes(search.toLowerCase()) || 
            o.phone.includes(search) || 
            o.id.toString().includes(search)
        );
        setFilteredOrders(result);
    }, [search, orders]);

    const handleView = (order) => {
        setSelectedOrder(order);
        setStatusToUpdate(order.status);
        setShowModal(true);
    };

    const updateStatus = async () => {
        if (statusToUpdate === 'Rejected' && !rejectReason) {
            alert("Please enter a reason for rejection.");
            return;
        }
        await axios.post('http://humancare.mywebcommunity.org/backend/update_order_status.php', {
            order_id: selectedOrder.id,
            status: statusToUpdate,
            reason: rejectReason
        });
        alert("Status Updated!");
        setShowModal(false);
        fetchOrders();
    };

    const printInvoice = () => {
        const printContent = document.getElementById("print-area").innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between mb-4">
                <h3>Customer Orders</h3>
                <InputGroup style={{width:'300px'}}>
                    <InputGroup.Text><FaSearch/></InputGroup.Text>
                    <Form.Control placeholder="Search Name, Phone, ID..." onChange={(e)=>setSearch(e.target.value)} />
                </InputGroup>
            </div>

            <div className="bg-white p-3 shadow-sm rounded">
                <Table hover responsive>
                    <thead className="bg-light">
                        <tr>
                            <th>Order No</th><th>Name</th><th>Phone</th><th>Total</th><th>Status</th><th>Date & Time</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>Order No. {order.id}</td>
                                <td className="fw-bold">{order.customer_name}</td>
                                <td>{order.phone}</td>
                                <td className="text-success fw-bold">Rs. {order.total_amount}</td>
                                <td>
                                    <Badge bg={
                                        order.status==='Delivered'?'success':
                                        order.status==='Rejected'?'danger':
                                        order.status==='On Way'?'info':
                                        'warning'
                                    }>{order.status}</Badge>
                                </td>
                                <td style={{fontSize:'12px'}}>
                                    {new Date(order.order_date).toLocaleString()}
                                </td>
                                <td><Button size="sm" onClick={() => handleView(order)}><FaEye/> View</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order Details #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div id="print-area" className="p-2">
                            <div className="text-center mb-4 border-bottom pb-3">
                                <h2>Human Care Pharmacy</h2>
                                <p>Order Receipt</p>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <div>
                                    <strong>Customer:</strong> {selectedOrder.customer_name}<br/>
                                    <strong>Phone:</strong> {selectedOrder.phone}<br/>
                                    <strong>Date:</strong> {new Date(selectedOrder.order_date).toLocaleString()}
                                </div>
                                <div className="text-end">
                                    <strong>Address:</strong><br/>{selectedOrder.address}, {selectedOrder.city}
                                </div>
                            </div>

                            <Table bordered>
                                <thead>
                                    <tr><th>Item</th><th>Unit</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.product_name}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <h4 className="text-end mt-3">Total: Rs. {selectedOrder.total_amount}</h4>

                            <div className="mt-4 small text-muted border-top pt-2">
                                {selectedOrder.processed_at && <p>Processing: {new Date(selectedOrder.processed_at).toLocaleString()}</p>}
                                {selectedOrder.packed_at && <p>Packed: {new Date(selectedOrder.packed_at).toLocaleString()}</p>}
                                {selectedOrder.shipped_at && <p>Shipped: {new Date(selectedOrder.shipped_at).toLocaleString()}</p>}
                                {selectedOrder.delivered_at && <p>Delivered: {new Date(selectedOrder.delivered_at).toLocaleString()}</p>}
                            </div>
                            
                            {selectedOrder.status === 'Rejected' && (
                                <div className="alert alert-danger mt-3">
                                    <strong>Reason for Rejection:</strong> {selectedOrder.rejection_reason}
                                </div>
                            )}
                        </div>
                    )}

                    <hr/>
                    <div className="d-flex align-items-center gap-3">
                        <Form.Select value={statusToUpdate} onChange={(e)=>setStatusToUpdate(e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="On Way">On Way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Rejected">Rejected</option>
                        </Form.Select>

                        {statusToUpdate === 'Rejected' && (
                            <Form.Control placeholder="Reason for rejection..." onChange={(e)=>setRejectReason(e.target.value)} />
                        )}

                        <Button variant="primary" onClick={updateStatus}>Update Status</Button>
                        <Button variant="dark" onClick={printInvoice}><FaPrint/> Print</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminOrders;
