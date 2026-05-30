import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price per piece is required'],
    min: [0, 'Price cannot be negative'],
  },
  priceHalfKg: {
    type: Number,
    min: [0, 'Price cannot be negative'],
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    default: 'brownie',
    trim: true,
    lowercase: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
