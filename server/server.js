const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders:  ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser
app.use(express. json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to CineBase API 🎬',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      movies:  '/api/movies'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongodb: 'Connected',
    server: 'Running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong! ',
    error: process.env.NODE_ENV === 'development' ? err.message :  undefined
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log('='. repeat(50));
  console.log(`🚀 CineBase Server Started`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API:  http://localhost:${PORT}`);
  console.log('='.repeat(50));
});