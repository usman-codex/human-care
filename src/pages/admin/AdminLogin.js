import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost/human-care/backend/admin_login.php', { email, password });
            if(res.data.success) {
                localStorage.setItem('adminToken', 'logged_in'); 
                navigate('/admin/dashboard');
            } else {
                alert("Ghalat Email ya Password!");
            }
        } catch(err) { 
            alert("Server Error"); 
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{height:'100vh', background:'#f0f2f5'}}>
            <Card className="p-4 shadow" style={{width:'400px'}}>
                <h3 className="text-center text-primary fw-bold mb-4">Admin Portal</h3>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Admin Email</Form.Label>
                        <Form.Control type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="admin@humancare.com" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Login to Dashboard</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default AdminLogin;
