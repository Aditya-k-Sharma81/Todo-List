const { TodoDAO } = require('../models/Todo');

// @desc    Get all todos with filtering, search & sorting
// @route   GET /api/todos
exports.getTodos = async (req, res) => {
  try {
    const { search, status, priority, category, assignee, createdDate, sortBy } = req.query;
    let todos = await TodoDAO.find();

    const getCreatedStr = (t) => {
      if (!t || !t.createdAt) return '';
      if (t.createdAt instanceof Date) return t.createdAt.toISOString();
      return String(t.createdAt);
    };

    // Filter by Search Query (Title, Description, Assignee, or Created Date)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      todos = todos.filter(t => {
        const cStr = getCreatedStr(t);
        const cLocale = t.createdAt ? new Date(t.createdAt).toLocaleDateString().toLowerCase() : '';
        return (
          (t.title && t.title.toLowerCase().includes(q)) || 
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.assignee && t.assignee.toLowerCase().includes(q)) ||
          (cStr && cStr.toLowerCase().includes(q)) ||
          (cLocale && cLocale.includes(q))
        );
      });
    }

    // Filter by Created Date (YYYY-MM-DD)
    if (createdDate && createdDate.trim()) {
      const cDate = createdDate.trim();
      todos = todos.filter(t => {
        const cStr = getCreatedStr(t);
        return cStr && cStr.startsWith(cDate);
      });
    }

    // Filter by Completion Status
    if (status === 'active') {
      todos = todos.filter(t => !(t.completed === true || t.completed === 'true'));
    } else if (status === 'completed') {
      todos = todos.filter(t => t.completed === true || t.completed === 'true');
    }

    // Filter by Priority Level
    if (priority && priority !== 'all') {
      todos = todos.filter(t => t.priority && t.priority.trim().toLowerCase() === priority.trim().toLowerCase());
    }

    // Filter by Category Tag
    if (category && category !== 'all') {
      todos = todos.filter(t => t.category && t.category.trim().toLowerCase() === category.trim().toLowerCase());
    }

    // Filter by Assignee Name
    if (assignee && assignee !== 'all') {
      todos = todos.filter(t => t.assignee && t.assignee.trim().toLowerCase() === assignee.trim().toLowerCase());
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
    const { title, description, priority, category, dueDate, assignee, subtasks } = req.body;

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
      assignee: assignee ? assignee.trim() : '',
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

// @desc    Update a specific subtask (title and/or completion status)
// @route   PUT /api/todos/:id/subtasks/:subtaskId
// @route   PATCH /api/todos/:id/subtasks/:subtaskId
exports.updateSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const { title, completed } = req.body || {};
    const existing = await TodoDAO.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const subtasks = existing.subtasks || [];
    const subtaskIndex = subtasks.findIndex(st => st.id === subtaskId);

    if (subtaskIndex === -1) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    if (title !== undefined && typeof title === 'string') {
      subtasks[subtaskIndex].title = title.trim();
    }

    if (completed !== undefined) {
      subtasks[subtaskIndex].completed = Boolean(completed);
    } else if (title === undefined) {
      // Toggle completion status if title not provided
      subtasks[subtaskIndex].completed = !subtasks[subtaskIndex].completed;
    }

    // Check if all subtasks are completed now
    const allCompleted = subtasks.length > 0 && subtasks.every(st => st.completed);

    const updated = await TodoDAO.update(id, {
      subtasks,
      completed: allCompleted
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ success: false, message: 'Server Error updating subtask' });
  }
};

exports.toggleSubtask = exports.updateSubtask;

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
    let totalProgressSum = 0;
    let completedCount = 0;

    todos.forEach(t => {
      const isTaskCompleted = Boolean(t.completed === true || t.completed === 'true');
      const subtasks = Array.isArray(t.subtasks) ? t.subtasks : [];
      const totalSub = subtasks.length;
      const completedSub = subtasks.filter(st => st.completed === true || st.completed === 'true').length;

      if (isTaskCompleted || (totalSub > 0 && completedSub === totalSub)) {
        completedCount++;
        totalProgressSum += 1;
      } else if (totalSub > 0) {
        totalProgressSum += (completedSub / totalSub);
      }
    });

    const pending = total - completedCount;
    const highPriority = todos.filter(t => {
      const isDone = Boolean(t.completed === true || t.completed === 'true');
      return !isDone && t.priority === 'High';
    }).length;

    const overdue = todos.filter(t => {
      const isDone = Boolean(t.completed === true || t.completed === 'true');
      return !isDone && t.dueDate && t.dueDate < today;
    }).length;

    const completionRate = total > 0 ? Math.round((totalProgressSum / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        completed: completedCount,
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
