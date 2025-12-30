// src/components/admin/DashboardLayout.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaChartLine, FaPills, FaUserTie, FaBoxOpen, FaSignOutAlt, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { FaFilePrescription } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            {/* --- SIDEBAR --- */}
            <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
                <h4 className="fw-bold mb-4 ps-2">Human Care <span style={{fontSize:'12px', color:'#aaa'}}>Admin</span></h4>
                <Nav className="flex-column gap-2">
                    <Link to="/admin/dashboard" className="nav-link text-white d-flex align-items-center"><FaChartLine className="me-2"/> Dashboard</Link>
                    <Link to="/admin/products" className="nav-link text-white d-flex align-items-center"><FaPills className="me-2"/> Medicines / Stock</Link>
                    <Link to="/admin/employees" className="nav-link text-white d-flex align-items-center"><FaUserTie className="me-2"/> Employees</Link>
                    <Link to="/admin/orders" className="nav-link text-white d-flex align-items-center"><FaBoxOpen className="me-2"/> Orders</Link>
                    <Link to="/admin/sales" className="nav-link text-white d-flex align-items-center"><FaMoneyBillWave className="me-2"/> Sales & Billing</Link>
                    <Link to="/admin/prescriptions" className="nav-link text-white d-flex align-items-center">
    <FaFilePrescription className="me-2"/> Prescriptions
</Link>
                    
                    <hr className="bg-secondary" />
                    
                    <div className="nav-link text-danger d-flex align-items-center" style={{cursor:'pointer'}} onClick={handleLogout}>
                        <FaSignOutAlt className="me-2"/> Logout
                    </div>
                </Nav>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-grow-1 p-4">
                {/* Top Header */}
                <div className="bg-white p-3 rounded shadow-sm mb-4 d-flex justify-content-between">
                    <h5 className="m-0 text-secondary">Overview</h5>
                    <div className="fw-bold">Admin: Super User</div>
                </div>
                
                {/* Page Content */}
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;