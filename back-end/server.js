import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound, rateLimiter } from './middleware/middlware.js';
import dotenv from 'dotenv';
import UserRouter from './routes/userRoute.js';
import fs from 'fs';


import contactRoutes from './routes/contactRoutes.js';



// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();



// Middleware - define these only once
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Consolidated CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://your-frontend-url.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Additional headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Apply rate limiter - 100 requests per 15 minutes
app.use(rateLimiter(100, 15 * 60 * 1000));


// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));



// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Debug middleware - consider removing in production
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});


// API routes
app.use('/api/foods', foodRoutes);
app.use('/api/users', UserRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});


// Middleware pour les routes
app.use('/api/users', UserRouter);
app.use('/api/foods', foodRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});


// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Example of a proper registration request
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:4000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export default app;