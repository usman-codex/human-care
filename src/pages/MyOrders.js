// src/pages/MyOrders.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, ProgressBar, Badge } from 'react-bootstrap';
import axios from 'axios';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const userId = 1;

    useEffect(() => {
        axios.get(`http://localhost/human-care/backend/get_user_orders.php?user_id=${userId}`)
            .then(res => setOrders(res.data));
    }, []);

    const getProgress = (status) => {
        if (status === 'Pending') return 10;
        if (status === 'Processing') return 30;
        if (status === 'Packed') return 50;
        if (status === 'On Way') return 80;
        if (status === 'Delivered') return 100;
        return 0; // Rejected
    };

    return (
        <Container className="mt-5 mb-5">
            <h2 className="mb-4">My Orders</h2>
            {orders.map((order) => {
                const progress = getProgress(order.status);
                return (
                    <Card key={order.id} className="mb-4 shadow-sm border-0">
                        <Card.Header className="bg-white d-flex justify-content-between py-3">
                            <div>
                                <small className="text-muted">ORDER ID</small>
                                <h5 className="m-0">#{order.id}</h5>
                            </div>
                            <div className="text-end">
                                <small className="text-muted">DATE</small>
                                <div>{new Date(order.order_date).toDateString()} {new Date(order.order_date).toLocaleTimeString()}</div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* PROGRESS BAR */}
                            {order.status !== 'Rejected' ? (
                                <div className="mb-4 px-2">
                                    <div className="d-flex justify-content-between small mb-1 fw-bold text-muted">
                                        <span className="text-primary">Placed</span>
                                        <span className={progress >= 30 ? "text-primary" : ""}>Processing</span>
                                        <span className={progress >= 50 ? "text-primary" : ""}>Packed</span>
                                        <span className={progress >= 80 ? "text-primary" : ""}>On Way</span>
                                        <span className={progress === 100 ? "text-success" : ""}>Delivered</span>
                                    </div>
                                    <ProgressBar now={progress} variant={progress===100?"success":"primary"} style={{height:'6px'}} animated={progress<100} />
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    <strong>Order Rejected:</strong> {order.rejection_reason}
                                </div>
                            )}

                            {/* ITEMS WITH IMAGES */}
                            {order.items.map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center border-bottom pb-3 mb-3">
                                    <img src={item.image} width="60" className="border rounded" alt=""/>
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-0 fw-bold">{item.product_name}</h6>
                                        <small className="text-muted">{item.unit} x {item.quantity}</small>
                                    </div>
                                    <span className="fw-bold">Rs. {item.price * item.quantity}</span>
                                </div>
                            ))}

                            {/* TIMELINE (History) */}
                            <div className="mt-3 small text-muted bg-light p-2 rounded">
                                <div>Placed: {new Date(order.order_date).toLocaleString()}</div>
                                {order.processed_at && <div>Processing: {new Date(order.processed_at).toLocaleString()}</div>}
                                {order.packed_at && <div>Packed: {new Date(order.packed_at).toLocaleString()}</div>}
                                {order.shipped_at && <div>On Way: {new Date(order.shipped_at).toLocaleString()}</div>}
                                {order.delivered_at && <div className="text-success fw-bold">Delivered: {new Date(order.delivered_at).toLocaleString()}</div>}
                            </div>

                            <div className="text-end mt-3">
                                <h4 className="text-primary">Rs. {order.total_amount}</h4>
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}
        </Container>
    );
};

export default MyOrders;