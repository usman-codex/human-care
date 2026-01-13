// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offcanvas, Button } from 'react-bootstrap';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import './App.css';

// IMPORTS
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout'; 
import MyOrders from './pages/MyOrders'; 
import UploadPrescription from './pages/UploadPrescription'; // New Page

// ADMIN IMPORTS
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminOrders from './pages/admin/AdminOrders'; 
import AdminSales from './pages/admin/AdminSales'; 
import AdminPrescriptions from './pages/admin/AdminPrescriptions'; 


// SECURITY ROUTES
const AdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('adminToken');
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const UserRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? children : <Navigate to="/" replace />;
};

function App() {
  // --- FIX: CART STATE INITIALIZATION (Load from Storage) ---
  const [cart, setCart] = useState(() => {
      const savedCart = localStorage.getItem('myShoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);
  const [triggerLogin, setTriggerLogin] = useState(false);

  // Load User from Storage
  useEffect(() => {
      const loggedUser = localStorage.getItem('user');
      if (loggedUser) setUser(JSON.parse(loggedUser));
  }, []);

  // --- FIX: SAVE CART TO STORAGE WHENEVER IT CHANGES ---
  useEffect(() => {
      localStorage.setItem('myShoppingCart', JSON.stringify(cart));
  }, [cart]);

  const openLoginModal = () => setTriggerLogin(prev => !prev);

  // --- CART FUNCTIONS ---
  const addToCart = (product) => {
    const exist = cart.find((x) => x.id === product.id && x.unit === product.unit);
    if (exist) {
      setCart(cart.map((x) => x.id === product.id && x.unit === product.unit ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      const itemImage = product.image || "https://placehold.co/200x200?text=No+Image";
      setCart([...cart, { ...product, image: itemImage, qty: 1 }]);
    }
    setShowCart(true); 
  };

  const clearCart = () => {
      setCart([]);
      localStorage.removeItem('myShoppingCart'); // Storage se bhi clear karo
  };

  const decreaseQty = (product) => {
      const exist = cart.find((x) => x.id === product.id && x.unit === product.unit);
      if (exist.qty === 1) {
          setCart(cart.filter((x) => x.id !== product.id || x.unit !== product.unit));
      } else {
          setCart(cart.map((x) => x.id === product.id && x.unit === product.unit ? { ...exist, qty: exist.qty - 1 } : x));
      }
  };

  const removeFromCart = (id, unit) => {
      setCart(cart.filter((x) => x.id !== id || x.unit !== unit));
  };

  // --- CALCULATIONS ---
  const subTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryCharges = cart.length > 0 ? 199 : 0; 
  const grandTotal = Math.round(subTotal + deliveryCharges);

  return (
    <Router>
      <div className="App">
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<><Header cartCount={cart.length} openCart={()=>setShowCart(true)} user={user} setUser={setUser} triggerLogin={triggerLogin} /><Home addToCart={addToCart} /></>} />
            
            <Route path="/product/:id" element={
                <>
                    <Header cartCount={cart.length} openCart={()=>setShowCart(true)} user={user} setUser={setUser} triggerLogin={triggerLogin} />
                    <ProductDetails cart={cart} addToCart={addToCart} decreaseQty={decreaseQty} />
                </>
            } />

            <Route path="/upload-prescription" element={
                <>
                    <Header cartCount={cart.length} openCart={()=>setShowCart(true)} user={user} setUser={setUser} />
                    <UploadPrescription />
                </>
            } />

            {/* SECURE USER */}
            <Route path="/checkout" element={
                <UserRoute>
                    <>
                        <Header cartCount={cart.length} openCart={()=>setShowCart(true)} user={user} setUser={setUser} />
                        <Checkout cart={cart} totals={{subTotal, deliveryCharges, grandTotal}} clearCart={clearCart} />
                    </>
                </UserRoute>
            } />

            <Route path="/my-orders" element={
                <UserRoute>
                    <>
                        <Header cartCount={cart.length} openCart={()=>setShowCart(true)} user={user} setUser={setUser} />
                        <MyOrders />
                    </>
                </UserRoute>
            } />

            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/employees" element={<AdminRoute><AdminEmployees /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/sales" element={<AdminRoute><AdminSales /></AdminRoute>} />
            <Route path="/admin/prescriptions" element={<AdminRoute><AdminPrescriptions /></AdminRoute>} />
            
        </Routes>

        {/* --- CART SIDEBAR --- */}
        <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end" style={{width:'400px', borderLeft:'5px solid #2761e7'}}>
            <Offcanvas.Header closeButton className="border-bottom bg-light">
                <Offcanvas.Title className="fw-bold text-dark d-flex align-items-center">
                    <FaShoppingBag className="me-2 text-primary"/> YOUR CART <span className="badge bg-primary ms-2 rounded-circle">{cart.length}</span>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column p-0">
                
                {cart.length === 0 ? (
                    <div className="text-center mt-5 text-muted p-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" width="100" className="mb-3 opacity-50" alt="Empty"/>
                        <h5>Your cart is empty!</h5>
                        <p>Start adding medicines to proceed.</p>
                        <Button variant="outline-primary" onClick={()=>setShowCart(false)}>Start Shopping</Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow-1 overflow-auto p-3">
                            {cart.map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center mb-3 bg-white p-2 rounded shadow-sm border">
                                    <div style={{width:'70px', height:'70px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <img src={item.image} style={{maxWidth:'100%', maxHeight:'100%'}} alt=""/>
                                    </div>
                                    
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-0 fw-bold text-dark" style={{fontSize:'14px', lineHeight:'1.2'}}>{item.name}</h6>
                                        <small className="text-muted d-block mb-2" style={{fontSize:'11px'}}>
                                            {item.manufacturer} • <span className="text-success fw-bold">{item.unit === 'pack' ? 'Pack' : 'Strip'}</span>
                                        </small>
                                        
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-primary">Rs. {item.price}</span>
                                            <div className="d-flex align-items-center bg-light rounded border">
                                                <button className="btn btn-sm px-2 text-muted" onClick={() => decreaseQty(item)}><FaMinus size={10}/></button>
                                                <span className="px-2 small fw-bold">{item.qty}</span>
                                                <button className="btn btn-sm px-2 text-primary" onClick={() => addToCart(item)}><FaPlus size={10}/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <FaTrash className="text-danger ms-3 me-2" style={{cursor:'pointer', opacity:0.7}} onClick={() => removeFromCart(item.id, item.unit)}/>
                                </div>
                            ))}
                        </div>

                        <div className="bg-light p-4 border-top">
                            <div className="d-flex justify-content-between mb-2 text-muted small"><span>Subtotal:</span> <span>Rs. {subTotal}</span></div>
                            <div className="d-flex justify-content-between mb-3 text-muted small"><span>Delivery Charges:</span> <span>Rs. {deliveryCharges}</span></div>
                            <div className="d-flex justify-content-between fw-bold border-top border-dark pt-3 mb-4" style={{fontSize:'18px'}}><span>Grand Total:</span> <span className="text-primary">Rs. {grandTotal}</span></div>
                            
                            {user ? (
                                <Link to="/checkout" onClick={()=>setShowCart(false)}>
                                    <Button className="w-100 py-3 fw-bold shadow-sm" style={{background:'#0f172a', border:'none', fontSize:'16px'}}>PROCEED TO CHECKOUT</Button>
                                </Link>
                            ) : (
                                <Button className="w-100 py-3 fw-bold shadow-sm btn-danger" onClick={()=>{setShowCart(false); openLoginModal();}}>LOGIN TO CHECKOUT</Button>
                            )}
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>

      </div>
    </Router>
  );
}

export default App;