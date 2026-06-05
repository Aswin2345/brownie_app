import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { isPondicherryAddress, SERVICE_AREA_MESSAGE } from '../utils/delivery.js';
import { sendWhatsAppNotification } from '../services/whatsapp.js';

const buildVerifiedItems = async (items) => {
  const productIds = items.map((item) => item.productId);
  const hasInvalidProductId = productIds.some(
    (productId) => !mongoose.Types.ObjectId.isValid(productId)
  );

  if (hasInvalidProductId) {
    throw new Error('One or more cart items are invalid. Please refresh your cart.');
  }

  const products = await Product.find({ _id: { $in: productIds }, available: true });
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));

  return items.map((item) => {
    const product = productsById.get(String(item.productId));

    if (!product) {
      throw new Error(`Product is unavailable: ${item.name || item.productId}`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Each order item must have a valid quantity');
    }

    const variant = item.variant === 'halfKg' ? 'halfKg' : 'piece';
    const price = variant === 'halfKg' ? product.priceHalfKg : product.price;
    const unitLabel = variant === 'halfKg' ? 'Half kg' : 'Piece';

    if (variant === 'halfKg' && (!price || price <= 0)) {
      throw new Error(`${product.name} is not available as half kg right now.`);
    }

    return {
      productId: product._id,
      name: product.name,
      quantity,
      variant,
      unitLabel,
      price,
    };
  });
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      customer,
      totalAmount,
      paymentMethod,
      razorpayOrderId,
      upiTransactionId,
      notes,
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item',
      });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone, and address are required',
      });
    }

    if (!isPondicherryAddress(customer)) {
      return res.status(400).json({
        success: false,
        message: SERVICE_AREA_MESSAGE,
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required',
      });
    }

    if (totalAmount <= 100) {
      return res.status(400).json({
        success: false,
        message: 'Your order total must be more than Rs.100. Please add one more item to continue.',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required',
      });
    }

    if (paymentMethod === 'razorpay' && !razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay order ID is required for online payment',
      });
    }

    if (paymentMethod === 'upi' && !String(upiTransactionId || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'UPI transaction/reference ID is required after payment',
      });
    }

    let verifiedItems;
    try {
      verifiedItems = await buildVerifiedItems(items);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const calculatedTotal = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (Number(totalAmount) !== calculatedTotal) {
      return res.status(400).json({
        success: false,
        message: 'Order total changed. Please refresh your cart and try again.',
      });
    }

    const orderData = {
      items: verifiedItems,
      customer,
      totalAmount: calculatedTotal,
      paymentMethod,
      notes,
    };

    // If paying via Razorpay, attach the Razorpay order ID
    if (paymentMethod === 'razorpay' && razorpayOrderId) {
      orderData.razorpayOrderId = razorpayOrderId;
    }

    if (paymentMethod === 'upi') {
      orderData.upiTransactionId = String(upiTransactionId).trim();
      orderData.paymentStatus = 'awaiting_verification';
      orderData.orderStatus = 'pending';
    }

    // COD orders are auto-confirmed
    if (paymentMethod === 'cod') {
      orderData.orderStatus = 'confirmed';
    }

    const order = await Order.create(orderData);

    // WHATSAPP: Send New Order Alert to Business Owner
    const adminPhone = process.env.WHATSAPP_OWNER_NUMBER || '916374923162';
    const itemsText = verifiedItems.map(item => `- ${item.name} (${item.unitLabel} x ${item.quantity})`).join('\n');
    const notesText = notes ? `\n*Notes:* ${notes}` : '';
    const msgToAdmin = `New Order Received!\n\nOrder ID: ${order.orderId}\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${customer.address}, ${customer.city} - ${customer.pincode}\nTotal: Rs.${calculatedTotal}\nPayment Method: ${paymentMethod.toUpperCase()}${notesText}\n\nItems:\n${itemsText}`;
    
    // WHATSAPP: Send Order Confirmation to Customer
    const customerItemsText = verifiedItems.map(item => `- ${item.name} (${item.unitLabel}) x ${item.quantity}`).join('\n');
    const paymentInfo = paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI (Awaiting verification)' : 'Online Payment';
    const msgToCustomer = `Thank you for ordering from Aswin Brownies!\n\nOrder ID: ${order.orderId}\n\nItems ordered:\n${customerItemsText}\n\nTotal: Rs.${calculatedTotal}\nPayment: ${paymentInfo}\nDelivery to: ${customer.address}, ${customer.city} - ${customer.pincode}\n\nWe will notify you when your order is being prepared. Thank you!`;
    const [ownerWhatsApp, customerWhatsApp] = await Promise.all([
      sendWhatsAppNotification(adminPhone, msgToAdmin),
      sendWhatsAppNotification(customer.phone, msgToCustomer),
    ]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        ...order.toObject(),
        notificationStatus: {
          ownerWhatsApp,
          customerWhatsApp,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by order status
    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }

    // Filter by payment status
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    // Filter by payment method
    if (req.query.paymentMethod) {
      filter.paymentMethod = req.query.paymentMethod;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID or orderId
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try finding by MongoDB _id first, then by orderId
    let order;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'Order status is required',
      });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const { id } = req.params;

    let order;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true, runValidators: true });
    }

    if (!order) {
      order = await Order.findOneAndUpdate({ orderId: id }, { orderStatus }, { new: true, runValidators: true });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // WHATSAPP: Send Status Update to Customer
    let statusMsg = '';
    switch (orderStatus) {
      case 'confirmed': statusMsg = 'has been confirmed and is in queue.'; break;
      case 'preparing': statusMsg = 'is currently being prepared by our bakers.'; break;
      case 'out_for_delivery': statusMsg = 'is out for delivery!'; break;
      case 'delivered': statusMsg = 'has been delivered. Enjoy your brownies!'; break;
      case 'cancelled': statusMsg = 'has been cancelled. Contact support for any queries.'; break;
    }
    
    if (statusMsg) {
       const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
       const msgToCustomer = `Hi ${order.customer.name}, your order *#${order.orderId}* from Aswin Brownies ${statusMsg}\n\nTrack your order here:\n${frontendUrl}/order-confirmation?orderId=${order.orderId}`;
       sendWhatsAppNotification(order.customer.phone, msgToCustomer).catch(console.error);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
