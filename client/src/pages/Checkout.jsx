import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ShoppingBag, CreditCard, Truck, Lock, ChevronLeft, User, Phone, Mail, MapPin, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder, createPaymentOrder, verifyPayment } from '../services/api';
import { initiatePayment } from '../services/razorpay';

const SERVICE_AREA_MESSAGE =
  'Delivery is currently available only in Pondicherry. We will be in more places soon.';

const isPondicherryAddress = ({ city, pincode }) => {
  const normalizedCity = city.trim().toLowerCase();
  return (
    (normalizedCity.includes('pondicherry') ||
      normalizedCity.includes('puducherry') ||
      normalizedCity.includes('pondy')) &&
    /^605\d{3}$/.test(pincode.trim())
  );
};

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const upiId = import.meta.env.VITE_UPI_ID || '';
  const upiPayeeName = import.meta.env.VITE_UPI_PAYEE_NAME || 'Sharp SK Brownies';

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'upi', or 'razorpay'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    notes: '',
    upiTransactionId: '',
  });

  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4 bg-chocolate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-8 rounded-2xl glass-card border border-gold-500/20 shadow-2xl"
        >
          <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-gold-500" size={32} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-cream mb-4">Your Cart is Empty</h2>
          <p className="text-cream/70 mb-8 leading-relaxed">
            You must add some delicious, fudgy brownies to your cart before checking out!
          </p>
          <Link
            to="/order"
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 text-chocolate-900 rounded-xl font-semibold shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all hover:scale-[1.02] duration-300"
          >
            Order Delicious Brownies
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (
      formData.city.trim() &&
      formData.pincode.trim() &&
      !isPondicherryAddress(formData)
    ) {
      newErrors.city = SERVICE_AREA_MESSAGE;
      newErrors.pincode = SERVICE_AREA_MESSAGE;
    }
    if (paymentMethod === 'upi') {
      if (!upiId) {
        newErrors.upiTransactionId = 'UPI payment is not configured yet. Please choose Cash on Delivery.';
      } else if (!formData.upiTransactionId.trim()) {
        newErrors.upiTransactionId = 'Enter the UPI transaction/reference ID after payment.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openUpiApp = () => {
    if (!upiId) {
      toast.error('UPI payment is not configured yet. Please choose Cash on Delivery.');
      return;
    }

    const upiUrl = new URL('upi://pay');
    upiUrl.searchParams.set('pa', upiId);
    upiUrl.searchParams.set('pn', upiPayeeName);
    upiUrl.searchParams.set('am', String(totalPrice));
    upiUrl.searchParams.set('cu', 'INR');
    upiUrl.searchParams.set('tn', `Sharp SK Brownies order ${Date.now()}`);

    window.location.href = upiUrl.toString();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setLoading(true);

    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
      totalAmount: totalPrice,
      paymentMethod,
      notes: formData.notes || '',
    };

    try {
      if (paymentMethod === 'cod') {
        const response = await createOrder(orderData);
        if (response.data.success) {
          toast.success('Order placed successfully! 🍫');
          clearCart();
          navigate('/order-confirmation', { state: { order: response.data.data } });
        } else {
          throw new Error(response.data.message || 'Failed to place order.');
        }
      } else if (paymentMethod === 'upi') {
        const response = await createOrder({
          ...orderData,
          upiTransactionId: formData.upiTransactionId,
        });

        if (response.data.success) {
          toast.success('UPI order submitted for verification.');
          clearCart();
          navigate('/order-confirmation', { state: { order: response.data.data } });
        } else {
          throw new Error(response.data.message || 'Failed to place order.');
        }
      } else if (paymentMethod === 'razorpay') {
        // Step 1: Create Razorpay order in backend.
        const paymentOrderRes = await createPaymentOrder({
          amount: totalPrice,
          currency: 'INR',
          notes: {
            customerName: formData.name,
            customerPhone: formData.phone,
          }
        });

        if (!paymentOrderRes.data.success || !paymentOrderRes.data.data.id) {
          throw new Error('Could not initialize digital payment. Please try COD.');
        }

        const razorpayOrderId = paymentOrderRes.data.data.id;

        // Step 2: Create our pending order before collecting payment.
        const newOrderRes = await createOrder({
          ...orderData,
          razorpayOrderId,
        });

        if (!newOrderRes.data.success) {
          throw new Error('Failed to record order details before payment.');
        }

        const dbOrder = newOrderRes.data.data;

        // Step 3: Open Razorpay popup.
        initiatePayment({
          orderId: razorpayOrderId,
          amount: totalPrice,
          customerInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          onSuccess: async (paymentDetails) => {
            try {
              toast.loading('Verifying payment...', { id: 'payment-loading' });

              // Step 4: Verify signature and mark the pending order as paid.
              const verifyRes = await verifyPayment({
                razorpay_order_id: paymentDetails.razorpay_order_id,
                razorpay_payment_id: paymentDetails.razorpay_payment_id,
                razorpay_signature: paymentDetails.razorpay_signature,
                orderId: dbOrder.orderId,
              });

              toast.dismiss('payment-loading');

              if (verifyRes.data.success) {
                toast.success('Payment verified! Order placed! 🎉');
                clearCart();
                navigate('/order-confirmation', { state: { order: verifyRes.data.data } });
              } else {
                throw new Error('Signature verification failed.');
              }
            } catch (err) {
              console.error('Payment callback error:', err);
              toast.error(err.message || 'Payment verification failed.');
              setLoading(false);
            }
          },
          onFailure: (errorMessage) => {
            toast.error(errorMessage || 'Payment failed or cancelled.');
            setLoading(false);
          },
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred during checkout.');
      setLoading(false);
    }
  };

  const deliveryFee = 0; // Free delivery

  return (
    <div className="min-h-screen pt-32 pb-24 bg-chocolate-900 text-cream px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to="/order"
          className="inline-flex items-center gap-2 text-gold-500/80 hover:text-gold-500 mb-8 transition-colors group"
        >
          <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-wide">Back to Ordering</span>
        </Link>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-12 tracking-wide text-center lg:text-left">
          Checkout <span className="gold-gradient-text">Details</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl glass-card border border-gold-500/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400" />
              
              <h2 className="text-2xl font-heading font-semibold mb-8 flex items-center gap-3">
                <Truck className="text-gold-500" size={24} />
                <span>Delivery Address</span>
              </h2>
              <div className="mb-6 rounded-xl border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-sm text-cream/80">
                {SERVICE_AREA_MESSAGE}
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="relative">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cream/40">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-chocolate-900/50 border ${
                          errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-chocolate-700/50 focus:border-gold-500/50'
                        } text-cream transition-all duration-300 font-medium`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cream/40">
                        <Phone size={18} />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-chocolate-900/50 border ${
                          errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-chocolate-700/50 focus:border-gold-500/50'
                        } text-cream transition-all duration-300 font-medium`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cream/40">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-chocolate-900/50 border ${
                        errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-chocolate-700/50 focus:border-gold-500/50'
                      } text-cream transition-all duration-300 font-medium`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                    Complete Address *
                  </label>
                  <div className="relative">
                    <span className="absolute top-3.5 left-3 flex items-start text-cream/40">
                      <MapPin size={18} />
                    </span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-chocolate-900/50 border ${
                        errors.address ? 'border-red-500/50 focus:border-red-500' : 'border-chocolate-700/50 focus:border-gold-500/50'
                      } text-cream transition-all duration-300 font-medium resize-none`}
                      placeholder="Flat/House No., Building Name, Street Address"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-chocolate-900/50 border ${
                        errors.city ? 'border-red-500/50 focus:border-red-500' : 'border-chocolate-700/50 focus:border-gold-500/50'
                      } text-cream transition-all duration-300 font-medium`}
                      placeholder="Pondicherry"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-chocolate-900/50 border ${
                        errors.pincode ? 'border-red-500/50 focus:border-red-500' : 'border-chocolate-700/50 focus:border-gold-500/50'
                      } text-cream transition-all duration-300 font-medium`}
                      placeholder="605001"
                      maxLength="6"
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                    Order Notes / Requests (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl bg-chocolate-900/50 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium resize-none"
                    placeholder="E.g., Please make it eggless, write Happy Birthday, deliver after 4 PM, etc."
                  />
                </div>

                {/* Payment Methods */}
                <div className="border-t border-chocolate-700/50 pt-8 mt-8">
                  <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-3">
                    <CreditCard className="text-gold-500" size={24} />
                    <span>Payment Method</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Cash On Delivery */}
                    <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                      paymentMethod === 'cod'
                        ? 'border-gold-500 bg-gold-500/5 shadow-md shadow-gold-500/5'
                        : 'border-chocolate-700/50 bg-chocolate-900/20 hover:border-gold-500/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-gold-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="font-semibold text-cream">Cash on Delivery</span>
                      </div>
                      <span className="text-xs text-cream-dark font-medium">Pay at door</span>
                    </label>

                    {/* Direct UPI */}
                    <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                      paymentMethod === 'upi'
                        ? 'border-gold-500 bg-gold-500/5 shadow-md shadow-gold-500/5'
                        : 'border-chocolate-700/50 bg-chocolate-900/20 hover:border-gold-500/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-gold-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="font-semibold text-cream">Direct UPI</span>
                      </div>
                      <span className="text-xs text-gold-500 font-medium">Manual verify</span>
                    </label>

                    {/* Razorpay Online */}
                    <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                      paymentMethod === 'razorpay'
                        ? 'border-gold-500 bg-gold-500/5 shadow-md shadow-gold-500/5'
                        : 'border-chocolate-700/50 bg-chocolate-900/20 hover:border-gold-500/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="accent-gold-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="font-semibold text-cream">Pay Online</span>
                      </div>
                      <span className="text-xs text-gold-500 font-medium">Razorpay (Cards/UPI)</span>
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-5 rounded-xl border border-gold-500/20 bg-chocolate-900/30 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-cream">Pay to UPI ID</p>
                          <p className="text-gold-500 font-mono text-sm break-all">
                            {upiId || 'Not configured'}
                          </p>
                          <p className="text-xs text-cream-dark mt-1">
                            After payment, enter the UPI transaction/reference ID below.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={openUpiApp}
                          disabled={!upiId}
                          className="px-4 py-3 rounded-xl bg-gold-500 text-chocolate-900 font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Smartphone size={18} />
                          Pay Rs.{totalPrice}
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                          UPI Transaction / Reference ID *
                        </label>
                        <input
                          type="text"
                          name="upiTransactionId"
                          value={formData.upiTransactionId}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-chocolate-900/50 border ${
                            errors.upiTransactionId ? 'border-red-500/50 focus:border-red-500' : 'border-chocolate-700/50 focus:border-gold-500/50'
                          } text-cream transition-all duration-300 font-medium`}
                          placeholder="Example: 412345678901"
                        />
                        {errors.upiTransactionId && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{errors.upiTransactionId}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Place Order CTA */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-chocolate-900 font-bold rounded-xl shadow-lg shadow-gold-500/10 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-chocolate-900 border-t-transparent rounded-full animate-spin" />
                  ) : paymentMethod === 'cod' ? (
                    'Confirm Cash on Delivery'
                  ) : paymentMethod === 'upi' ? (
                    'Submit UPI Order for Verification'
                  ) : (
                    'Proceed to Pay Online'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-8 rounded-2xl glass-card border border-gold-500/10 shadow-2xl relative"
            >
              <h2 className="text-2xl font-heading font-semibold mb-8 pb-4 border-b border-chocolate-700/50">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-gold-500/10 relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-gold-500 text-chocolate-900 rounded-full border border-chocolate-900">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cream text-sm sm:text-base line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-cream-dark">₹{item.price} each</p>
                      </div>
                    </div>
                    <span className="font-semibold text-cream">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="space-y-3 border-t border-chocolate-700/50 pt-6 text-sm">
                <div className="flex justify-between text-cream/70">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-cream/70">
                  <span>Delivery Fee</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-heading font-bold text-cream pt-3 border-t border-chocolate-800">
                  <span>Total Amount</span>
                  <span className="gold-gradient-text">₹{totalPrice}</span>
                </div>
              </div>

              {/* Security info */}
              <div className="mt-8 flex items-center gap-3 justify-center p-3 rounded-xl bg-chocolate-800/40 border border-chocolate-700/30">
                <Lock className="text-gold-500" size={16} />
                <span className="text-xs text-cream-dark font-medium">
                  Secure Checkout. Your details are safe with us.
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
