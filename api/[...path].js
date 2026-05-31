import app from '../server/app.js';
import connectDB from '../server/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Express app is a standard (req, res) handler — works directly with Vercel
    await new Promise((resolve, reject) => {
      res.on('finish', resolve);
      res.on('error', reject);
      app(req, res);
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    // Only send error response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Server initialization failed: ' + error.message,
      });
    }
  }
}