import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';

// Load .env from server/ directory (not CWD which differs on Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Warn if critical payment env vars are missing (common on Vercel when .env is gitignored)
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    '⚠️  RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not found in environment.',
    'Payments will run in MOCK/TEST mode.',
    'Set these in Vercel Dashboard → Settings → Environment Variables for production.'
  );
}

const app = express();

const allowedOrigins = new Set(
  (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean)
);

if (process.env.VERCEL_URL) {
  allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
}

allowedOrigins.add('http://localhost:5173');

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, server-to-server, same-origin)
      if (!origin) return callback(null, true);
      // Allow if explicitly listed
      if (allowedOrigins.has(origin)) return callback(null, true);
      // Allow any Vercel deployment (preview URLs change on every deploy)
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// General API rate limit: 200 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Strict limit for order creation: 10 requests per 15 minutes
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many order attempts. Please try again later.' },
});

// Strict limit for payment endpoints: 10 per 15 minutes
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment attempts. Please try again later.' },
});


app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sharp SK Brownies API is running 🍫',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/payment', paymentLimiter, paymentRoutes);

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

export default app;