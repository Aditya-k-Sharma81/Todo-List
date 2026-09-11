const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  toggleSubtask,
  updateSubtask,
  deleteTodo,
  getStats
} = require('../controllers/todoController');

// Routes relative to /api/todos
router.get('/', getTodos);
router.get('/stats', getStats);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.put('/:id/subtasks/:subtaskId', updateSubtask || toggleSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);
router.delete('/:id', deleteTodo);

module.exports = router;
