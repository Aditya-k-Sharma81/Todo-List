import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatsSummary } from '../components/StatsSummary';
import { FilterBar } from '../components/FilterBar';
import { TodoCard } from '../components/TodoCard';
import { TodoModal } from '../components/TodoModal';
import { Plus, Sparkles, Inbox, RefreshCw } from 'lucide-react';
import { showDeleteConfirm, showSuccessToast, showErrorAlert } from '../utils/alerts';

export const TodoListPage = ({ onOpenCreateModal }) => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    assignee: 'all',
    createdDate: '',
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
    let isSubscribed = true;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [todosRes, statsRes] = await Promise.all([
          api.getTodos(filters),
          api.getStats()
        ]);
        if (isSubscribed) {
          setTodos(todosRes.data || []);
          setStats(statsRes.data || {});
        }
      } catch (err) {
        if (isSubscribed) {
          console.error('Error loading page data:', err);
          setError('Failed to connect to backend API server. Make sure the server is running on port 5000.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isSubscribed = false;
    };
  }, [filters]);

  const handleToggle = async (id) => {
    try {
      // Optimistic update: update task completion AND all its subtasks completion
      setTodos(prev => prev.map(t => {
        if (t.id !== id) return t;
        const newCompleted = !t.completed;
        const updatedSubtasks = (t.subtasks || []).map(st => ({
          ...st,
          completed: newCompleted
        }));
        return {
          ...t,
          completed: newCompleted,
          subtasks: updatedSubtasks
        };
      }));

      const res = await api.toggleTodo(id);
      if (res?.data) {
        setTodos(prev => prev.map(t => t.id === id ? res.data : t));
      }

      // Refresh stats
      const statsRes = await api.getStats();
      setStats(statsRes.data || {});
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const handleDelete = async (id) => {
    const target = todos.find(t => t.id === id);
    const result = await showDeleteConfirm({
      title: 'Delete Task?',
      text: target?.title ? `Are you sure you want to delete "${target.title}"?` : 'Are you sure you want to delete this task?',
      confirmButtonText: 'Yes, Delete Task'
    });

    if (!result.isConfirmed) return;

    try {
      setTodos(prev => prev.filter(t => t.id !== id));
      await api.deleteTodo(id);
      showSuccessToast('Task deleted successfully');
      const statsRes = await api.getStats();
      setStats(statsRes.data || {});
    } catch (err) {
      console.error(err);
      loadData();
      showErrorAlert('Failed to delete task. Please try again.');
    }
  };

  const handleOpenCreate = () => {
    if (onOpenCreateModal) {
      onOpenCreateModal();
    } else {
      setEditingTodo(null);
      setIsEditModalOpen(true);
    }
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleSaveTodo = async (todoData) => {
    try {
      if (editingTodo) {
        await api.updateTodo(editingTodo.id, todoData);
        showSuccessToast('Task updated successfully');
      } else {
        await api.createTodo(todoData);
        showSuccessToast('Task created successfully');
      }
      setIsEditModalOpen(false);
      setEditingTodo(null);
      loadData();
    } catch (err) {
      console.error('Error saving todo:', err);
      showErrorAlert('Error saving task. Please try again.');
    }
  };

  // Compute dynamic stats from todos array to ensure stats are always up to date
  const computedStats = React.useMemo(() => {
    if (stats && stats.total !== undefined && stats.total > 0) return stats;

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
    const highPriority = todos.filter(t => !t.completed && t.priority === 'High').length;
    const completionRate = total > 0 ? Math.round((totalProgressSum / total) * 100) : 0;

    return { total, completed: completedCount, pending, highPriority, completionRate, ...stats };
  }, [todos, stats]);

  return (
    <div className="app-container">
      {/* Metrics Dashboard */}
      <StatsSummary stats={computedStats} filters={filters} onFilterChange={setFilters} />

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
            {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all' || filters.createdDate
              ? 'No task matches your current search or date filter criteria. Try resetting filters.'
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

      {/* Edit Modal Dialog */}
      <TodoModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingTodo(null); }}
        onSave={handleSaveTodo}
        initialTodo={editingTodo}
      />
    </div>
  );
};
