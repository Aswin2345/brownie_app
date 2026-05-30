import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Order must have at least one item'],
    validate: {
      validator: (items) => items.length > 0,
      message: 'Order must have at least one item',
    },
  },
  customer: {
    type: customerSchema,
    required: [true, 'Customer information is required'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['razorpay', 'upi', 'cod'],
      message: 'Payment method must be razorpay, upi, or cod',
    },
    required: [true, 'Payment method is required'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'awaiting_verification', 'paid', 'failed'],
    default: 'pending',
  },
  upiTransactionId: {
    type: String,
    trim: true,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate orderId before saving
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = 'SK-' + Date.now();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
