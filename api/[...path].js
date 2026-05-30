import serverless from 'serverless-http';
import app from '../server/app.js';
import connectDB from '../server/config/db.js';

const handler = serverless(app);

export default async function (req, res) {
  try {
    await connectDB();
    return handler(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      success: false,
      message: 'Server initialization failed: ' + error.message,
    });
  }
}