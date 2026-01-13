import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const AuthModal = ({ show, handleClose, handleLoginSuccess }) => {
    const [mode, setMode] = useState('login'); 
    const [showPassword, setShowPassword] = useState(false);
    
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);

    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage(""); 
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                const googleData = {
                    name: userInfo.data.name,
                    email: userInfo.data.email,
                    google_id: userInfo.data.sub
                };

                const res = await axios.post('http://humancare.mywebcommunity.org/backend/google_auth.php', googleData);

                if (res.data.success) {
                    setSuccessMessage("Google Login Successful!");
                    setTimeout(() => {
                        handleLoginSuccess(res.data.user);
                    }, 1000);
                } else {
                    setErrorMessage("Database Error: " + res.data.message);
                }
            } catch (error) {
                console.log(error);
                setErrorMessage("Failed to login with Google");
            }
        },
        onError: () => setErrorMessage("Google Login Failed"),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (mode === 'signup') {
            try {
                const res = await axios.post('http://humancare.mywebcommunity.org/backend/register.php', formData);
                if (res.data.success) {
                    setShowSuccessScreen(true);
                } else {
                    setErrorMessage(res.data.message);
                }
            } catch (error) { 
                setErrorMessage("Server Connection Error"); 
            }
        } 
        else if (mode === 'login') {
            try {
                const res = await axios.post('http://humancare.mywebcommunity.org/backend/login.php', formData);
                if (res.data.success) {
                    setSuccessMessage("Login Successful!");
                    setTimeout(() => {
                        handleLoginSuccess(res.data.user);
                    }, 1000);
                } else {
                    setErrorMessage(res.data.message);
                }
            } catch (error) { 
                setErrorMessage("Server Connection Error"); 
            }
        }
    };

    if (showSuccessScreen) {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body className="text-center p-5">
                    <FaCheckCircle size={60} color="green" className="mb-3"/>
                    <h3 className="fw-bold">Account Created!</h3>
                    <p>You have successfully registered.</p>
                    <Button variant="primary" onClick={() => { setShowSuccessScreen(false); setMode('login'); }}>
                        Go to Login
                    </Button>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold text-primary">
                    {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4 pb-4">
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><FaUser/></InputGroup.Text>
                                    <Form.Control name="name" onChange={handleChange} required />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><FaPhone/></InputGroup.Text>
                                    <Form.Control name="phone" onChange={handleChange} required />
                                </InputGroup>
                            </Form.Group>
                        </>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FaEnvelope/></InputGroup.Text>
                            <Form.Control type="email" name="email" onChange={handleChange} required />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FaLock/></InputGroup.Text>
                            <Form.Control type={showPassword ? "text" : "password"} name="password" onChange={handleChange} required />
                            <InputGroup.Text style={{cursor:'pointer'}} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mb-3 py-2 fw-bold">
                        {mode === 'login' ? 'Login' : 'Sign Up'}
                    </Button>

                    <div className="text-center mb-3">OR</div>
                    
                    <Button variant="outline-danger" className="w-100 py-2" onClick={() => googleLogin()}>
                        <FaGoogle className="me-2"/> Continue with Gmail
                    </Button>

                    <div className="text-center mt-3">
                        {mode === 'login' ? (
                            <>Don't have an account? <span className="text-primary fw-bold" style={{cursor:'pointer'}} onClick={() => setMode('signup')}>Sign Up</span></>
                        ) : (
                            <>Already have an account? <span className="text-primary fw-bold" style={{cursor:'pointer'}} onClick={() => setMode('login')}>Login</span></>
                        )}
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;
