const { TodoDAO } = require('../models/Todo');

// @desc    Get all todos with filtering, search & sorting
// @route   GET /api/todos
exports.getTodos = async (req, res) => {
  try {
    const { search, status, priority, category, sortBy } = req.query;
    let todos = await TodoDAO.find();

    // Filter by Search Query (Title or Description)
    if (search) {
      const q = search.toLowerCase();
      todos = todos.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    // Filter by Completion Status
    if (status === 'active') {
      todos = todos.filter(t => !t.completed);
    } else if (status === 'completed') {
      todos = todos.filter(t => t.completed);
    }

    // Filter by Priority Level
    if (priority && priority !== 'all') {
      todos = todos.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    // Filter by Category Tag
    if (category && category !== 'all') {
      todos = todos.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    // Sorting
    if (sortBy === 'priority') {
      const pRank = { High: 3, Medium: 2, Low: 1 };
      todos.sort((a, b) => (pRank[b.priority] || 0) - (pRank[a.priority] || 0));
    } else if (sortBy === 'dueDate') {
      todos.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'oldest') {
      todos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // Default: newest first
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching todos' });
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoDAO.findById(id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo item not found' });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching single todo' });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
exports.createTodo = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate, subtasks } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const formattedSubtasks = (subtasks || []).map((s, idx) => ({
      id: s.id || `st-${Date.now()}-${idx}`,
      title: typeof s === 'string' ? s : s.title,
      completed: typeof s === 'object' && s.completed ? true : false
    }));

    const newTodo = await TodoDAO.create({
      title: title.trim(),
      description: description || '',
      priority: priority || 'Medium',
      category: category || 'Work',
      dueDate: dueDate || '',
      subtasks: formattedSubtasks,
      completed: false
    });

    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ success: false, message: 'Server Error creating todo' });
  }
};

// @desc    Update existing todo
// @route   PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TodoDAO.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const updated = await TodoDAO.update(id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, message: 'Server Error updating todo' });
  }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
exports.toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TodoDAO.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const newCompleted = !existing.completed;
    // If todo is toggled completed, toggle all subtasks completed as well
    const updatedSubtasks = existing.subtasks ? existing.subtasks.map(st => ({
      ...st,
      completed: newCompleted
    })) : [];

    const updated = await TodoDAO.update(id, {
      completed: newCompleted,
      subtasks: updatedSubtasks
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ success: false, message: 'Server Error toggling todo' });
  }
};

// @desc    Toggle a specific subtask completion status
// @route   PATCH /api/todos/:id/subtasks/:subtaskId
exports.toggleSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const existing = await TodoDAO.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const subtasks = existing.subtasks || [];
    const subtaskIndex = subtasks.findIndex(st => st.id === subtaskId);

    if (subtaskIndex === -1) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    subtasks[subtaskIndex].completed = !subtasks[subtaskIndex].completed;

    // Check if all subtasks are completed now
    const allCompleted = subtasks.length > 0 && subtasks.every(st => st.completed);

    const updated = await TodoDAO.update(id, {
      subtasks,
      completed: allCompleted
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error toggling subtask:', error);
    res.status(500).json({ success: false, message: 'Server Error toggling subtask' });
  }
};

// @desc    Delete todo item
// @route   DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await TodoDAO.delete(id);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo deleted successfully', id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting todo' });
  }
};

// @desc    Get aggregate task metrics
// @route   GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const todos = await TodoDAO.find();
    const today = new Date().toISOString().split('T')[0];

    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter(t => !t.completed && t.priority === 'High').length;
    const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        highPriority,
        overdue,
        completionRate
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, message: 'Server Error getting stats' });
  }
};
