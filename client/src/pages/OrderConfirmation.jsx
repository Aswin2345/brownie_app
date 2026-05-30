import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const OWNER_WHATSAPP = '916374923162';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handleWhatsAppNotify = () => {
    const itemsText = order.items
      .map((item) => `- ${item.name} x ${item.quantity} (Rs.${item.price})`)
      .join('\n');
    const paymentReference = order.upiTransactionId
      ? `\n*UPI Reference:* ${order.upiTransactionId}`
      : '';

    const message = `New order for Sharp SK Brownies\n\n*Order ID:* ${order.orderId}\n*Name:* ${order.customer.name}\n*Phone:* ${order.customer.phone}\n*Address:* ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}\n*Items:*\n${itemsText}\n\n*Total Amount:* Rs.${order.totalAmount}\n*Payment Method:* ${order.paymentMethod.toUpperCase()}\n*Payment Status:* ${order.paymentStatus.toUpperCase().replaceAll('_', ' ')}${paymentReference}`;

    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-chocolate-900 text-cream px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card border border-gold-500/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400" />

          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 bg-gold-500/10 border-2 border-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative"
          >
            <CheckCircle2 className="text-gold-500 w-12 h-12" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4 tracking-wide text-cream">
            Order Placed <span className="gold-gradient-text">Successfully!</span>
          </h1>
          <p className="text-cream/70 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Thank you for ordering with us. Send the order details to WhatsApp so we can confirm and prepare it quickly.
          </p>

          <div className="p-4 rounded-xl bg-chocolate-800/50 border border-gold-500/10 max-w-sm mx-auto mb-10 flex flex-col items-center justify-center gap-1">
            <span className="text-xs uppercase tracking-[0.2em] text-cream-dark font-semibold">Your Order ID</span>
            <span className="text-xl sm:text-2xl font-bold gold-gradient-text font-mono tracking-wider">{order.orderId}</span>
          </div>

          <div className="text-left bg-chocolate-800/20 border border-chocolate-700/30 rounded-xl p-6 mb-10 max-w-xl mx-auto space-y-6">
            <h3 className="font-heading font-semibold text-lg text-cream border-b border-chocolate-700/50 pb-3">
              Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wider text-cream-dark mb-1">Customer Name</span>
                <span className="font-medium text-cream">{order.customer.name}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-cream-dark mb-1">Phone Number</span>
                <span className="font-medium text-cream">{order.customer.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs uppercase tracking-wider text-cream-dark mb-1">Shipping Address</span>
                <span className="font-medium text-cream block leading-relaxed">
                  {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-cream-dark mb-1">Payment Method</span>
                <span className="font-medium text-cream uppercase">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-cream-dark mb-1">Payment Status</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-amber-400'}`}>
                  {order.paymentStatus.replaceAll('_', ' ')}
                </span>
              </div>
              {order.upiTransactionId && (
                <div className="sm:col-span-2">
                  <span className="block text-xs uppercase tracking-wider text-cream-dark mb-1">UPI Reference</span>
                  <span className="font-mono text-gold-500">{order.upiTransactionId}</span>
                </div>
              )}
            </div>

            <div className="border-t border-chocolate-700/50 pt-5">
              <span className="block text-xs uppercase tracking-wider text-cream-dark mb-3">Items Ordered</span>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-cream/80">
                      {item.name} <span className="text-gold-500 font-semibold">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-cream">Rs.{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-base font-bold font-heading text-cream border-t border-chocolate-800 pt-3 mt-3">
                  <span>Grand Total</span>
                  <span className="gold-gradient-text">Rs.{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <button
              onClick={handleWhatsAppNotify}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl shadow-lg shadow-[#25D366]/10 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] duration-300"
            >
              <FaWhatsapp size={22} />
              <span>Send to WhatsApp</span>
            </button>
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-3.5 bg-chocolate-800 border border-gold-500/20 hover:border-gold-500 text-cream font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] duration-300 shadow-md"
            >
              <ShoppingBag size={20} className="text-gold-500" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
