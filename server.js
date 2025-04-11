const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Reset collections if in development mode
const resetCollections = async () => {
  if (process.env.NODE_ENV === 'development' && process.env.RESET_DB === 'true') {
    try {
      console.log('Resetting collections...');
      
      // Get all collections
      const collections = mongoose.connection.collections;
      
      // Drop the users collection if it exists
      if (collections.users) {
        await collections.users.drop();
        console.log('Users collection dropped successfully');
      }
      
      console.log('Collections reset complete');
    } catch (error) {
      console.error('Error resetting collections:', error);
    }
  }
};

// Call reset collections
resetCollections();

const app = express();

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/statistics', statisticsRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 