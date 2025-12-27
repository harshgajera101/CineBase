const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv. config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration - More permissive
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route with detailed logging
app.get('/', (req, res) => {
  console.log('✅ GET / route hit');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ 
    success: true,
    message: 'Welcome to CineBase API 🎬',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  console.log('✅ GET /health route hit');
  res.status(200).json({ 
    status: 'OK',
    mongodb: 'Connected',
    server: 'Running'
  });
});



// Test route to get all movies (limited)
app.get('/api/movies', async (req, res) => {
  try {
    const Movie = require('./models/Movie');
    const movies = await Movie.find().limit(10).sort({ rank: 1 });
    console.log(`✅ GET /api/movies - Found ${movies.length} movies`);
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});



// 404 handler
app.use((req, res) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
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
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🔗 URL: http://127.0.0.1:${PORT}`);
  console.log('='.repeat(50));
});