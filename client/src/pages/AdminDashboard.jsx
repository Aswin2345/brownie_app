import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Layers,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Menu,
  X,
  FileText,
  TrendingUp,
  Settings,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus
} from '../services/api';

export default function AdminDashboard() {
  const { admin, token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Authentication redirection
  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, authLoading, navigate]);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'stats'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Form Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    priceHalfKg: '',
    image: '',
    category: 'classic',
    available: true,
    featured: false,
  });

  // Fetch initial dashboard data
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([getProducts(), getOrders()]);
      setProducts(prodRes.data.data || []);
      setOrders(ordRes.data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard data. Check authorization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/admin/login', { replace: true });
  };

  // Product Form handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      toast.error('Product name and price are required.');
      return;
    }

    try {
      const formattedData = {
        ...productForm,
        price: Number(productForm.price),
        priceHalfKg: productForm.priceHalfKg ? Number(productForm.priceHalfKg) : undefined,
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, formattedData);
        toast.success('Product updated successfully! 🍫');
      } else {
        await createProduct(formattedData);
        toast.success('Product added successfully! 🎉');
      }

      setProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        priceHalfKg: '',
        image: '',
        category: 'classic',
        available: true,
        featured: false,
      });
      fetchData(); // Reload list
    } catch (err) {
      console.error('Product save error:', err);
      toast.error(err.response?.data?.message || 'Error saving product details.');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      priceHalfKg: product.priceHalfKg || '',
      image: product.image || '',
      category: product.category || 'brownie',
      available: product.available ?? true,
      featured: product.featured ?? false,
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted.');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  // Export Orders CSV
  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      toast.error('No orders to export.');
      return;
    }
    
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'City', 'Pincode', 'Total Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Items'];
    
    const csvRows = orders.map(order => {
      const date = new Date(order.createdAt).toLocaleString();
      const customerName = order.customer?.name || '';
      const phone = order.customer?.phone || '';
      const address = order.customer?.address ? order.customer.address.replace(/"/g, '""') : '';
      const city = order.customer?.city || '';
      const pincode = order.customer?.pincode || '';
      const itemsStr = order.items?.map(item => `${item.name} (x${item.quantity})`).join(' | ') || '';
      
      return [
        order.orderId,
        date,
        customerName,
        phone,
        address,
        city,
        pincode,
        order.totalAmount,
        order.paymentMethod,
        order.paymentStatus,
        order.orderStatus,
        itemsStr
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
    });
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `brownies_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported successfully!');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to: ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error('Status update error:', err);
      toast.error('Failed to update order status.');
    }
  };

  // Stats derivations
  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'paid' || order.orderStatus === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrdersCount = orders.filter(order => order.orderStatus === 'pending').length;
  const preparingOrdersCount = orders.filter(order => order.orderStatus === 'preparing').length;

  if (authLoading || !token) {
    return (
      <div className="min-h-screen bg-chocolate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sidebarLinks = [
    { id: 'orders', name: 'Orders', icon: FileText },
    { id: 'products', name: 'Products Menu', icon: Layers },
    { id: 'stats', name: 'Business Stats', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-chocolate-900 text-cream flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gold-500/10 bg-chocolate-950 p-6 flex-shrink-0">
        <div className="mb-10">
          <h2 className="text-2xl font-heading font-bold gold-gradient-text">Sharp SK</h2>
          <p className="text-xs uppercase tracking-widest text-cream-dark/60 font-semibold mt-1">Admin Panel</p>
        </div>

        <nav className="space-y-2 flex-grow">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium tracking-wide transition-all ${
                  activeTab === link.id
                    ? 'bg-gold-500 text-chocolate-900 shadow-lg shadow-gold-500/10'
                    : 'text-cream/70 hover:text-cream hover:bg-chocolate-800/40'
                }`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-chocolate-850">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center font-bold text-gold-500">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-semibold text-sm text-cream">{admin?.name || 'Administrator'}</p>
              <p className="text-xs text-cream-dark/70 font-light truncate max-w-[130px]">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-400 font-semibold transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Toggle Menu */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 z-50 bg-chocolate-950 p-6 flex flex-col border-r border-gold-500/10"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-heading font-bold gold-gradient-text">Sharp SK</h2>
                  <p className="text-xs uppercase tracking-widest text-cream-dark/60 mt-1">Admin Panel</p>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 bg-chocolate-900 rounded-xl text-cream-dark"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2 flex-grow">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium tracking-wide transition-all ${
                        activeTab === link.id
                          ? 'bg-gold-500 text-chocolate-900'
                          : 'text-cream/70 hover:text-cream hover:bg-chocolate-800/40'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{link.name}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-chocolate-850">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-400 font-semibold transition-all"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Panel Content */}
      <main className="flex-grow min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        {/* Top Navbar Header */}
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-chocolate-850">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-chocolate-850 rounded-xl hover:bg-chocolate-800 border border-chocolate-700/50"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-cream">
                {activeTab === 'orders' && 'Manage Orders'}
                {activeTab === 'products' && 'Menu Products'}
                {activeTab === 'stats' && 'Dashboard Overview'}
              </h1>
              <p className="text-xs sm:text-sm text-cream-dark mt-1 font-light">
                Monitor and process bakery operations.
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl bg-chocolate-800 border border-gold-500/10 hover:border-gold-500/30 text-cream transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            Refresh
          </button>
        </header>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Business KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="p-6 rounded-2xl bg-chocolate-950/60 border border-gold-500/5 shadow-xl flex items-center gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-600/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20">
                  <DollarSign size={24} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-cream-dark/60 font-semibold block">Total Revenue</span>
                  <span className="text-2xl font-bold font-mono gold-gradient-text">₹{totalRevenue}</span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="p-6 rounded-2xl bg-chocolate-950/60 border border-gold-500/5 shadow-xl flex items-center gap-5 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-cream-dark/60 font-semibold block">Total Orders</span>
                  <span className="text-2xl font-bold font-mono text-cream">{orders.length}</span>
                </div>
              </div>

              {/* Pending Orders */}
              <div className="p-6 rounded-2xl bg-chocolate-950/60 border border-gold-500/5 shadow-xl flex items-center gap-5 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Clock size={24} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-cream-dark/60 font-semibold block">Pending Orders</span>
                  <span className="text-2xl font-bold font-mono text-amber-400">{pendingOrdersCount}</span>
                </div>
              </div>

              {/* Preparing Orders */}
              <div className="p-6 rounded-2xl bg-chocolate-950/60 border border-gold-500/5 shadow-xl flex items-center gap-5 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Layers size={24} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-cream-dark/60 font-semibold block">Preparing</span>
                  <span className="text-2xl font-bold font-mono text-blue-400">{preparingOrdersCount}</span>
                </div>
              </div>
            </div>

            {/* TAB CONTENTS */}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="glass-card border border-gold-500/10 overflow-hidden shadow-2xl relative">
                <div className="p-6 border-b border-chocolate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-heading font-semibold text-cream">Order History</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-cream-dark/60 font-medium">
                      Showing {orders.length} orders
                    </div>
                    <button
                      onClick={exportOrdersCSV}
                      className="px-4 py-2 bg-chocolate-800 border border-gold-500/30 text-gold-500 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-gold-500 hover:text-chocolate-900 transition-all flex items-center gap-2 shadow-lg shadow-gold-500/5"
                    >
                      <FileText size={14} />
                      Download CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-chocolate-950/80 text-cream-dark text-xs uppercase tracking-wider font-semibold border-b border-chocolate-850">
                        <th className="p-4 sm:p-5">Order ID</th>
                        <th className="p-4 sm:p-5">Customer</th>
                        <th className="p-4 sm:p-5">Details</th>
                        <th className="p-4 sm:p-5">Total</th>
                        <th className="p-4 sm:p-5">Payment</th>
                        <th className="p-4 sm:p-5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-chocolate-850">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-10 text-center text-cream/50">
                            No orders placed yet.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order._id} className="hover:bg-chocolate-850/20 transition-colors">
                            <td className="p-4 sm:p-5 font-mono font-bold text-gold-500 whitespace-nowrap">
                              {order.orderId}
                            </td>
                            <td className="p-4 sm:p-5 whitespace-nowrap">
                              <div className="font-semibold text-cream">{order.customer?.name}</div>
                              <div className="text-xs text-cream-dark font-light">{order.customer?.phone}</div>
                            </td>
                            <td className="p-4 sm:p-5 max-w-[200px]">
                              <div className="text-xs space-y-1">
                                {order.items?.map((it, idx) => (
                                  <div key={idx} className="truncate">
                                    {it.name} <span className="text-gold-500 font-bold">x{it.quantity}</span>
                                  </div>
                                ))}
                                {order.notes && (
                                  <div className="text-[10px] text-amber-400 italic mt-1 font-medium truncate max-w-full">
                                    Note: {order.notes}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 sm:p-5 font-bold font-mono text-cream whitespace-nowrap">
                              ₹{order.totalAmount}
                            </td>
                            <td className="p-4 sm:p-5 whitespace-nowrap">
                              <div className="text-xs font-semibold uppercase">{order.paymentMethod}</div>
                              {order.upiTransactionId && (
                                <div className="text-[10px] text-gold-500 font-mono mt-1">
                                  UPI: {order.upiTransactionId}
                                </div>
                              )}
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase inline-block mt-1 ${
                                order.paymentStatus === 'paid'
                                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                  : order.paymentStatus === 'failed'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {order.paymentStatus.replaceAll('_', ' ')}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 whitespace-nowrap text-center">
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                className={`text-xs font-semibold py-1.5 px-3 rounded-lg bg-chocolate-900 border text-cream focus:border-gold-500 cursor-pointer ${
                                  order.orderStatus === 'delivered'
                                    ? 'border-green-500/30 text-green-400'
                                    : order.orderStatus === 'cancelled'
                                    ? 'border-red-500/30 text-red-400'
                                    : 'border-chocolate-700'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-chocolate-950/60 p-6 rounded-2xl border border-gold-500/10 shadow-lg">
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-cream">Bakery Products Menu</h3>
                    <p className="text-xs text-cream-dark mt-1 font-light">Add, edit, or delete brownie items displayed on the store.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        priceHalfKg: '',
                        image: '',
                        category: 'brownie',
                        available: true,
                        featured: false,
                      });
                      setProductModalOpen(true);
                    }}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-chocolate-900 font-bold transition-all shadow-md flex items-center gap-2 text-sm hover:scale-[1.02]"
                  >
                    <Plus size={18} />
                    <span>Add Brownie</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.length === 0 ? (
                    <div className="col-span-full p-16 text-center rounded-2xl glass-card text-cream/50">
                      No brownies in DB. Click Add Brownie to create!
                    </div>
                  ) : (
                    products.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        className="glass-card border border-gold-500/10 relative overflow-hidden shadow-xl"
                      >
                        {/* Image banner */}
                        <div className="h-48 relative overflow-hidden border-b border-chocolate-850">
                          <img
                            src={product.image || '/images/chocolate-brownie.png'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            {product.featured && (
                              <span className="text-[10px] px-2 py-0.5 bg-gold-500 text-chocolate-900 font-extrabold uppercase rounded-full shadow">
                                Featured
                              </span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-full shadow ${
                              product.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {product.available ? 'Available' : 'Sold Out'}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-6">
                          <h4 className="text-lg font-heading font-bold text-cream mb-2 truncate">{product.name}</h4>
                          <p className="text-xs text-cream-dark/80 line-clamp-2 min-h-[32px] mb-4 font-light leading-relaxed">
                            {product.description || 'No description provided.'}
                          </p>

                          {/* Pricing */}
                          <div className="flex justify-between items-center mb-6 pb-4 border-b border-chocolate-850">
                            <div>
                              <span className="text-[10px] uppercase text-cream-dark/60 font-semibold block">Piece Price</span>
                              <span className="font-bold text-cream font-mono">₹{product.price}</span>
                            </div>
                            {product.priceHalfKg && (
                              <div className="text-right">
                                <span className="text-[10px] uppercase text-cream-dark/60 font-semibold block">Half KG Price</span>
                                <span className="font-bold text-gold-500 font-mono">₹{product.priceHalfKg}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 justify-between items-center">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="px-4 py-2 border border-gold-500/20 hover:border-gold-500 text-cream text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 flex-grow justify-center"
                            >
                              <Edit size={14} className="text-gold-500" />
                              <span>Edit Details</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-450 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Orders metrics info */}
                <div className="glass-card p-6 border border-gold-500/10">
                  <h3 className="text-xl font-heading font-semibold text-cream mb-6 flex items-center gap-3">
                    <TrendingUp className="text-gold-500" size={20} />
                    <span>Order Insights</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-chocolate-850">
                      <span className="text-cream/70 font-medium">Completed Deliveries</span>
                      <span className="font-bold text-cream">{orders.filter(o => o.orderStatus === 'delivered').length}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-chocolate-850">
                      <span className="text-cream/70 font-medium">Out for Delivery</span>
                      <span className="font-bold text-cream">{orders.filter(o => o.orderStatus === 'out_for_delivery').length}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-chocolate-850">
                      <span className="text-cream/70 font-medium">Preparing in Kitchen</span>
                      <span className="font-bold text-cream">{preparingOrdersCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-chocolate-850">
                      <span className="text-cream/70 font-medium">Cancelled / Rejected</span>
                      <span className="font-bold text-red-400">{orders.filter(o => o.orderStatus === 'cancelled').length}</span>
                    </div>
                  </div>
                </div>

                {/* Sales stats Box */}
                <div className="glass-card p-6 border border-gold-500/10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-cream mb-6 flex items-center gap-3">
                      <ShoppingBag className="text-gold-500" size={20} />
                      <span>Financial Performance</span>
                    </h3>
                    <div className="p-6 rounded-2xl bg-chocolate-900/50 border border-gold-500/5 text-center my-6">
                      <span className="text-xs uppercase tracking-widest text-cream-dark/60 font-semibold block mb-2">Total Earnings</span>
                      <span className="text-4xl font-extrabold gold-gradient-text font-mono">₹{totalRevenue}</span>
                      <p className="text-[10px] text-cream-dark/50 mt-3">Excludes cancelled and unpaid pending orders.</p>
                    </div>
                  </div>
                  <div className="text-xs text-cream-dark leading-relaxed text-center font-light border-t border-chocolate-850 pt-4">
                    Data synced in real time with the bakery MongoDB database cluster.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      <AnimatePresence>
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-chocolate-950 border border-gold-500/15 w-full max-w-2xl rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400" />
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-cream">
                  {editingProduct ? 'Edit Brownie Details' : 'Add New Brownie'}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="p-2 hover:bg-chocolate-900 rounded-xl text-cream-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-chocolate-900 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm"
                      placeholder="e.g. Nutella Brownie"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      Category
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-chocolate-900 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm cursor-pointer"
                    >
                      <option value="classic">Classic Brownies</option>
                      <option value="chocolate">Chocolate Brownies</option>
                      <option value="nut">Nut Brownies</option>
                      <option value="premium">Premium Brownies</option>
                      <option value="giftbox">Gift Boxes</option>
                    </select>
                  </div>

                  {/* Piece Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      Price per Piece (₹) *
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-chocolate-900 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm"
                      placeholder="e.g. 40"
                      required
                    />
                  </div>

                  {/* Half KG Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      Price per Half KG (Optional - ₹)
                    </label>
                    <input
                      type="number"
                      value={productForm.priceHalfKg}
                      onChange={(e) => setProductForm(p => ({ ...p, priceHalfKg: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-chocolate-900 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm"
                      placeholder="e.g. 450"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl bg-chocolate-900 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm resize-none"
                    placeholder="Describe the texture, fudge factor, toppings, etc..."
                  />
                </div>

                {/* Image Path */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                    Product Image Route or URL
                  </label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm(p => ({ ...p, image: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-chocolate-900 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm"
                    placeholder="e.g. /images/nutella-brownie.png"
                  />
                  <p className="text-[10px] text-cream-dark/50 mt-1.5">
                    Recommended local paths: /images/chocolate-brownie.png, nutella-brownie.png, oreo-brownie.png, walnut-brownie.png, choco-lava-brownie.png, white-chocolate-brownie.png
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-chocolate-900/40 p-4 rounded-xl border border-chocolate-850">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.available}
                      onChange={(e) => setProductForm(p => ({ ...p, available: e.target.checked }))}
                      className="accent-gold-500 w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-cream">Available in Stock</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm(p => ({ ...p, featured: e.target.checked }))}
                      className="accent-gold-500 w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-cream">Feature on Homepage</span>
                  </label>
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-3.5 mt-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-chocolate-900 font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>{editingProduct ? 'Save Changes' : 'Create Product Entry'}</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
