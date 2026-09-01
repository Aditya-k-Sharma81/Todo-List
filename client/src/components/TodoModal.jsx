import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export const TodoModal = ({ isOpen, onClose, onSave, initialTodo = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title || '');
      setDescription(initialTodo.description || '');
      setPriority(initialTodo.priority || 'Medium');
      setCategory(initialTodo.category || 'Work');
      setDueDate(initialTodo.dueDate || '');
      setSubtasks(initialTodo.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCategory('Work');
      setDueDate('');
      setSubtasks([]);
    }
    setNewSubtaskTitle('');
  }, [initialTodo, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      subtasks
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem' }} className="gradient-text">
            {initialTodo ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description & Notes</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Add relevant context, instructions, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Row: Priority & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Priority Level</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Subtasks Section */}
          <div className="form-group">
            <label>Subtasks & Checklist Items</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(e); } }}
              />
              <button type="button" onClick={handleAddSubtask} className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem' }}>
                <Plus size={18} />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
                {subtasks.map((st) => (
                  <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.5)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{st.title}</span>
                    <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="btn-icon" style={{ color: '#fca5a5', padding: '0.2rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialTodo ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
