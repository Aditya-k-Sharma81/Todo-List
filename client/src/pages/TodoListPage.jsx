import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatsSummary } from '../components/StatsSummary';
import { FilterBar } from '../components/FilterBar';
import { TodoCard } from '../components/TodoCard';
import { TodoModal } from '../components/TodoModal';
import { Plus, Sparkles, Inbox, RefreshCw } from 'lucide-react';

export const TodoListPage = ({ isModalOpen, setIsModalOpen }) => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'newest'
  });

  const [viewMode, setViewMode] = useState('grid');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [todosRes, statsRes] = await Promise.all([
        api.getTodos(filters),
        api.getStats()
      ]);
      setTodos(todosRes.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error('Error loading page data:', err);
      setError('Failed to connect to backend API server. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleToggle = async (id) => {
    try {
      // Optimistic update
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      await api.toggleTodo(id);
      // Refresh stats
      const statsRes = await api.getStats();
      setStats(statsRes.data || {});
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setTodos(prev => prev.filter(t => t.id !== id));
      await api.deleteTodo(id);
      const statsRes = await api.getStats();
      setStats(statsRes.data || {});
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveTodo = async (todoData) => {
    try {
      if (editingTodo) {
        await api.updateTodo(editingTodo.id, todoData);
      } else {
        await api.createTodo(todoData);
      }
      setIsModalOpen(false);
      setEditingTodo(null);
      loadData();
    } catch (err) {
      console.error('Error saving todo:', err);
      alert('Error saving task. Please try again.');
    }
  };

  return (
    <div className="app-container">
      {/* Metrics Dashboard */}
      <StatsSummary stats={stats} />

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Error Banner */}
      {error && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{error}</span>
          <button onClick={loadData} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Main Todo Items Grid/List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="spin-animation" style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
          <p>Loading your tasks...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--accent-primary)' }}>
            <Inbox size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No tasks found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
            {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all'
              ? 'No task matches your current search or filter criteria. Try resetting filters.'
              : 'Your task list is empty. Get started by creating your first task!'}
          </p>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={18} /> Create First Task
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'todos-grid' : 'todos-list-view'}>
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTodo(null); }}
        onSave={handleSaveTodo}
        initialTodo={editingTodo}
      />
    </div>
  );
};
