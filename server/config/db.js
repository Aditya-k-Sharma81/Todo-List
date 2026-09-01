const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tododb';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB database successfully.');
  } catch (error) {
    isMongoConnected = false;
    console.log('ℹ️  MongoDB connection not active. Switched seamlessly to File DB persistence (data/todos.json).');
  }
};

const getIsMongoConnected = () => isMongoConnected;

module.exports = { connectDB, getIsMongoConnected };
