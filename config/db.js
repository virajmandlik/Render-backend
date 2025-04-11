const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Explicitly set the database name to job-track-app
    const mongoUri = process.env.MONGO_URI;
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'job-track-app', // Force specific database name
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using database: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 