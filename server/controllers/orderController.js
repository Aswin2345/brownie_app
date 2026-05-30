import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { isPondicherryAddress, SERVICE_AREA_MESSAGE } from '../utils/delivery.js';

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

    return {
      productId: product._id,
      name: product.name,
      quantity,
      price: product.price,
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

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
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

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
