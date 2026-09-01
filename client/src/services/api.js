const API_BASE = '/api/todos';

export const api = {
  // Fetch all todos with query parameters
  async getTodos(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') queryParams.append('priority', filters.priority);
    if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

    const res = await fetch(`${API_BASE}?${queryParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return await res.json();
  },

  // Fetch single todo by ID
  async getTodoById(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Todo with ID ${id} not found`);
    return await res.json();
  },

  // Create new todo
  async createTodo(todoData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return await res.json();
  },

  // Update existing todo
  async updateTodo(id, todoData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return await res.json();
  },

  // Toggle todo completion status
  async toggleTodo(id) {
    const res = await fetch(`${API_BASE}/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to toggle todo');
    return await res.json();
  },

  // Toggle subtask completion
  async toggleSubtask(id, subtaskId) {
    const res = await fetch(`${API_BASE}/${id}/subtasks/${subtaskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to toggle subtask');
    return await res.json();
  },

  // Delete todo
  async deleteTodo(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete todo');
    return await res.json();
  },

  // Get aggregated stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  }
};
