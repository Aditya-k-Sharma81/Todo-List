const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Todo App REST API Server is running',
    endpoints: {
      todos: '/api/todos',
      stats: '/api/todos/stats',
      singleTodo: '/api/todos/:id'
    }
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });
});
