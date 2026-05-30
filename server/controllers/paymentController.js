import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';

const hasValidRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  return (
    keyId &&
    keySecret &&
    !keyId.includes('placeholder') &&
    !keySecret.includes('placeholder')
  );
};

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Public
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    if (!hasValidRazorpayConfig()) {
      return res.status(503).json({
        success: false,
        message:
          'Online payment is not configured yet. Add Razorpay keys or use Cash on Delivery.',
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature and update order
// @route   POST /api/payment/verify
// @access  Public
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!hasValidRazorpayConfig()) {
      return res.status(503).json({
        success: false,
        message: 'Online payment verification is not configured yet.',
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification details are required',
      });
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      // Update order payment status to failed
      if (orderId) {
        await Order.findOneAndUpdate(
          { orderId },
          { paymentStatus: 'failed' },
          { new: true }
        );
      }

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }

    // Update order with payment details
    let order = null;
    if (orderId) {
      const existingOrder = await Order.findOne({ orderId });

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found for payment verification.',
        });
      }

      if (existingOrder.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed. Razorpay order mismatch.',
        });
      }

      const razorpay = getRazorpayInstance();
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
      const expectedAmount = Math.round(existingOrder.totalAmount * 100);

      if (razorpayOrder.amount !== expectedAmount) {
        await Order.findOneAndUpdate({ orderId }, { paymentStatus: 'failed' });

        return res.status(400).json({
          success: false,
          message: 'Payment verification failed. Paid amount does not match order total.',
        });
      }

      order = await Order.findOneAndUpdate(
        { orderId },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
        },
        { new: true }
      );
    } else {
      // Fallback: find by razorpayOrderId
      const existingOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found for payment verification.',
        });
      }

      const razorpay = getRazorpayInstance();
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
      const expectedAmount = Math.round(existingOrder.totalAmount * 100);

      if (razorpayOrder.amount !== expectedAmount) {
        await Order.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          { paymentStatus: 'failed' }
        );

        return res.status(400).json({
          success: false,
          message: 'Payment verification failed. Paid amount does not match order total.',
        });
      }

      order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
