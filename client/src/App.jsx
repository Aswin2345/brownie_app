import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/layout/LoadingScreen';
import WhatsAppButton from './components/common/WhatsAppButton';
import CartDrawer from './components/cart/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderOnline from './pages/OrderOnline';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <div className="relative min-h-screen bg-chocolate-900 text-cream selection:bg-gold-500/30 selection:text-cream">
            {/* Loading screen overlay */}
            <LoadingScreen />
            
            {/* Main Navigation */}
            <Navbar />
            
            {/* Cart Drawer */}
            <CartDrawer />
            
            {/* Page Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order" element={<OrderOnline />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
            
            {/* WhatsApp Floating Chat Button */}
            <WhatsAppButton />
            
            {/* Main Footer */}
            <Footer />
          </div>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
