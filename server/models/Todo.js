const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { getIsMongoConnected } = require('../config/db');

const dataFilePath = path.join(__dirname, '../data/todos.json');

// Mongoose Schema for MongoDB
const subtaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const todoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    category: { type: String, default: 'Work' },
    dueDate: { type: String, default: '' },
    subtasks: [subtaskSchema]
  },
  { timestamps: true }
);

const MongoTodo = mongoose.model('Todo', todoSchema);

// File helper functions
const readTodosFromFile = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(rawData || '[]');
  } catch (err) {
    console.error('Error reading todos from file:', err);
    return [];
  }
};

const writeTodosToFile = (todos) => {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing todos to file:', err);
  }
};

// Unified Data Access Object (DAO) for MongoDB / File DB
class TodoDAO {
  static async find(query = {}) {
    if (getIsMongoConnected()) {
      let count = await MongoTodo.countDocuments();
      if (count === 0) {
        const seedData = readTodosFromFile();
        if (seedData.length > 0) {
          await MongoTodo.insertMany(seedData);
          console.log('🌱 Seeded initial sample tasks into MongoDB database.');
        }
      }
      const docs = await MongoTodo.find().sort({ createdAt: -1 });
      return docs.map(doc => doc.toObject());
    } else {
      let todos = readTodosFromFile();
      return todos.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
  }

  static async findById(id) {
    if (getIsMongoConnected()) {
      const doc = await MongoTodo.findOne({ id });
      return doc ? doc.toObject() : null;
    } else {
      const todos = readTodosFromFile();
      return todos.find(t => t.id === id) || null;
    }
  }

  static async create(todoData) {
    const newId = todoData.id || `todo-${Date.now()}`;
    const now = new Date().toISOString();
    const formattedTodo = {
      id: newId,
      title: todoData.title || 'Untitled Todo',
      description: todoData.description || '',
      completed: !!todoData.completed,
      priority: todoData.priority || 'Medium',
      category: todoData.category || 'Work',
      dueDate: todoData.dueDate || '',
      subtasks: Array.isArray(todoData.subtasks) ? todoData.subtasks : [],
      createdAt: now,
      updatedAt: now
    };

    if (getIsMongoConnected()) {
      const doc = new MongoTodo(formattedTodo);
      await doc.save();
      return doc.toObject();
    } else {
      const todos = readTodosFromFile();
      todos.unshift(formattedTodo);
      writeTodosToFile(todos);
      return formattedTodo;
    }
  }

  static async update(id, updateData) {
    const now = new Date().toISOString();
    if (getIsMongoConnected()) {
      const doc = await MongoTodo.findOneAndUpdate(
        { id },
        { $set: { ...updateData, updatedAt: now } },
        { new: true }
      );
      return doc ? doc.toObject() : null;
    } else {
      const todos = readTodosFromFile();
      const index = todos.findIndex(t => t.id === id);
      if (index === -1) return null;

      todos[index] = {
        ...todos[index],
        ...updateData,
        updatedAt: now
      };
      writeTodosToFile(todos);
      return todos[index];
    }
  }

  static async delete(id) {
    if (getIsMongoConnected()) {
      const res = await MongoTodo.deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const todos = readTodosFromFile();
      const initialLen = todos.length;
      const filtered = todos.filter(t => t.id !== id);
      if (filtered.length !== initialLen) {
        writeTodosToFile(filtered);
        return true;
      }
      return false;
    }
  }
}

module.exports = { MongoTodo, TodoDAO };
