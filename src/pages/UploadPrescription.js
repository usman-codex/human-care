// src/pages/UploadPrescription.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaUpload, FaCloudUploadAlt } from 'react-icons/fa';

const UploadPrescription = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('image', file);
        
      const user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            formData.append('user_id', user.id); 
        }

        try {
            const res = await axios.post('http://localhost/human-care/backend/upload_prescription.php', formData);
            if(res.data.success) {
                setMessage({type: 'success', text: 'Prescription Uploaded Successfully! Our pharmacist will call you shortly.'});
                setName(''); setPhone(''); setFile(null);
            } else {
                setMessage({type: 'danger', text: 'Upload Failed.'});
            }
        } catch(err) { setMessage({type: 'danger', text: 'Server Error'}); }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight:'80vh'}}>
            <Card className="shadow-lg border-0 p-4" style={{maxWidth:'500px', width:'100%'}}>
                <div className="text-center mb-4">
                    <FaCloudUploadAlt size={60} className="text-primary mb-2"/>
                    <h3 className="fw-bold">Upload Prescription</h3>
                    <p className="text-muted">Upload your doctor's slip and we will deliver medicines to you.</p>
                </div>

                {message && <Alert variant={message.type}>{message.text}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control value={name} onChange={(e)=>setName(e.target.value)} required placeholder="e.g Ali" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control value={phone} onChange={(e)=>setPhone(e.target.value)} required placeholder="0300-1234567" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Select Image</Form.Label>
                        <Form.Control type="file" onChange={(e)=>setFile(e.target.files[0])} required accept="image/*" />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                        <FaUpload className="me-2"/> Submit Prescription
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default UploadPrescription;