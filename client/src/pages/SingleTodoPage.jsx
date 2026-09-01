import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { TodoModal } from '../components/TodoModal';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Tag, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Plus, 
  AlertCircle,
  FileText,
  History
} from 'lucide-react';

export const SingleTodoPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const todoId = searchParams.get('id');

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const loadSingleTodo = async () => {
    if (!todoId) {
      setLoading(false);
      setError('No todo ID parameter provided in URL. Please select a task from the list.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.getTodoById(todoId);
      setTodo(res.data);
    } catch (err) {
      console.error('Error fetching single todo:', err);
      setError(`Todo with ID "${todoId}" was not found or could not be loaded.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSingleTodo();
  }, [todoId]);

  const handleToggleTodo = async () => {
    if (!todo) return;
    try {
      const updated = { ...todo, completed: !todo.completed };
      setTodo(updated);
      await api.toggleTodo(todo.id);
      loadSingleTodo();
    } catch (err) {
      console.error(err);
      loadSingleTodo();
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    if (!todo) return;
    try {
      // Optimistic update
      const updatedSubtasks = (todo.subtasks || []).map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      setTodo({ ...todo, subtasks: updatedSubtasks });

      await api.toggleSubtask(todo.id, subtaskId);
      loadSingleTodo();
    } catch (err) {
      console.error(err);
      loadSingleTodo();
    }
  };

  const handleAddSubtaskDirect = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !todo) return;

    const newSubtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };

    const updatedSubtasks = [...(todo.subtasks || []), newSubtask];

    try {
      setTodo({ ...todo, subtasks: updatedSubtasks });
      setNewSubtaskTitle('');
      await api.updateTodo(todo.id, { ...todo, subtasks: updatedSubtasks });
      loadSingleTodo();
    } catch (err) {
      console.error(err);
      loadSingleTodo();
    }
  };

  const handleDeleteTodo = async () => {
    if (!todo) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTodo(todo.id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  const handleSaveEdit = async (updatedData) => {
    if (!todo) return;
    try {
      await api.updateTodo(todo.id, updatedData);
      setIsEditModalOpen(false);
      loadSingleTodo();
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
        <Clock size={32} className="spin-animation" style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
        <p>Loading todo details...</p>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="app-container">
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: '#fca5a5' }}>
            <AlertCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Task Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.75rem auto', fontSize: '0.95rem' }}>
            {error || 'The task you are looking for does not exist or has been removed.'}
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Todos List
          </Link>
        </div>
      </div>
    );
  }

  const { title, description, completed, priority, category, dueDate, subtasks = [], createdAt, updatedAt } = todo;

  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const totalSubtasks = subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  const priorityClass = priority === 'High' ? 'badge-high' : priority === 'Medium' ? 'badge-medium' : 'badge-low';
  const isOverdue = dueDate && !completed && new Date(dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={18} /> Back to List
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handleToggleTodo} className={`btn ${completed ? 'btn-secondary' : 'btn-primary'}`}>
            {completed ? <CheckCircle2 size={18} color="#34d399" /> : <Circle size={18} />}
            <span>{completed ? 'Completed' : 'Mark Completed'}</span>
          </button>
          <button onClick={() => setIsEditModalOpen(true)} className="btn btn-secondary">
            <Edit3 size={18} /> Edit Task
          </button>
          <button onClick={handleDeleteTodo} className="btn btn-danger">
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {/* Main Single Todo Card Details */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* URL Parameter Demo Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem'
        }}>
          <span>Query Parameter ID:</span>
          <code style={{ color: '#a5b4fc', fontWeight: 600 }}>{todo.id}</code>
        </div>

        {/* Priority & Category Badges */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className={`badge ${priorityClass}`}>{priority} Priority</span>
          <span className="badge badge-category">Category: {category}</span>
          <span className={`badge ${completed ? 'badge-status-completed' : 'badge-status-pending'}`}>
            Status: {completed ? 'Done' : 'Active'}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '2rem', marginBottom: '1.25rem', lineHeight: 1.3, color: completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: completed ? 'line-through' : 'none' }}>
          {title}
        </h1>

        {/* Description */}
        <div style={{ marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.4)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <FileText size={16} /> Description & Context Notes
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {description || 'No detailed description provided for this task.'}
          </p>
        </div>

        {/* Subtasks Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={20} color="var(--accent-primary)" /> Subtasks Checklist
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {completedSubtasks} of {totalSubtasks} Completed ({subtaskProgress}%)
            </span>
          </div>

          <div className="progress-bar-bg" style={{ height: '8px', marginBottom: '1.25rem' }}>
            <div className="progress-bar-fill" style={{ width: `${subtaskProgress}%` }}></div>
          </div>

          {/* Direct Subtask Add Input */}
          <form onSubmit={handleAddSubtaskDirect} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Add new subtask item..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              <Plus size={18} /> Add Subtask
            </button>
          </form>

          {/* Subtask Items List */}
          {subtasks.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', italic: true }}>No subtasks added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleToggleSubtask(st.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ color: st.completed ? '#34d399' : 'var(--text-muted)' }}>
                    {st.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </span>
                  <span style={{
                    fontSize: '0.925rem',
                    color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: st.completed ? 'line-through' : 'none'
                  }}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata Timeline Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} color={isOverdue ? '#fca5a5' : 'var(--text-muted)'} />
            <span>Due Date: <strong style={{ color: isOverdue ? '#fca5a5' : 'var(--text-primary)' }}>{dueDate || 'None set'}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="var(--text-muted)" />
            <span>Created: <strong>{new Date(createdAt).toLocaleDateString()}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <History size={16} color="var(--text-muted)" />
            <span>Last Modified: <strong>{new Date(updatedAt).toLocaleDateString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Edit Modal Dialog */}
      <TodoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialTodo={todo}
      />
    </div>
  );
};
