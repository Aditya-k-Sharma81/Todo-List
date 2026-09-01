const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  toggleSubtask,
  deleteTodo,
  getStats
} = require('../controllers/todoController');

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.get('/stats', getStats);

router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

router.patch('/:id/toggle', toggleTodo);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

module.exports = router;
