import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Calendar, CheckSquare, Edit3, Trash2, ExternalLink } from 'lucide-react';

export const TodoCard = ({ todo, onToggle, onEdit, onDelete, viewMode = 'grid' }) => {
  const { id, title, description, completed, priority, category, dueDate, subtasks = [] } = todo;

  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const totalSubtasks = subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const priorityClass = priority === 'High' ? 'badge-high' : priority === 'Medium' ? 'badge-medium' : 'badge-low';

  const isOverdue = dueDate && !completed && new Date(dueDate) < new Date(new Date().setHours(0,0,0,0));

  if (viewMode === 'list') {
    return (
      <div className="glass-panel" style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        opacity: completed ? 0.7 : 1,
        borderLeft: `4px solid ${priority === 'High' ? 'var(--priority-high)' : priority === 'Medium' ? 'var(--priority-medium)' : 'var(--priority-low)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
          <button
            onClick={() => onToggle(id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: completed ? '#34d399' : 'var(--text-muted)' }}
          >
            {completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className={`badge ${priorityClass}`}>{priority}</span>
              <span className="badge badge-category">{category}</span>
              <Link
                to={`/todo?id=${id}`}
                style={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: completed ? 'line-through' : 'none',
                  color: completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {title}
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {totalSubtasks > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckSquare size={14} /> {completedSubtasks}/{totalSubtasks}
            </span>
          )}

          {dueDate && (
            <span style={{
              fontSize: '0.75rem',
              color: isOverdue ? '#fca5a5' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: isOverdue ? 600 : 400
            }}>
              <Calendar size={14} /> {dueDate}
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link to={`/todo?id=${id}`} className="btn-icon" title="View Full Details">
              <ExternalLink size={16} />
            </Link>
            <button onClick={() => onEdit(todo)} className="btn-icon" title="Edit Todo">
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(id)} className="btn-icon" title="Delete Todo" style={{ color: '#fca5a5' }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div className="glass-panel" style={{
      padding: '1.35rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      opacity: completed ? 0.75 : 1,
      borderTop: `3px solid ${priority === 'High' ? 'var(--priority-high)' : priority === 'Medium' ? 'var(--priority-medium)' : 'var(--priority-low)'}`
    }}>
      <div>
        {/* Top Badges & Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className={`badge ${priorityClass}`}>{priority}</span>
            <span className="badge badge-category">{category}</span>
          </div>

          <button
            onClick={() => onToggle(id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: completed ? '#34d399' : 'var(--text-muted)' }}
            title={completed ? 'Mark pending' : 'Mark completed'}
          >
            {completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
        </div>

        {/* Title Link */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          <Link
            to={`/todo?id=${id}`}
            style={{
              color: completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: completed ? 'line-through' : 'none'
            }}
          >
            {title}
          </Link>
        </h3>

        {/* Description Snippet */}
        {description && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {description}
          </p>
        )}
      </div>

      <div>
        {/* Subtasks Progress */}
        {totalSubtasks > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Subtasks Checklist</span>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <div className="progress-bar-bg" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${subtaskProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Footer Meta & Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: '0.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: isOverdue ? '#fca5a5' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} />
            <span>{dueDate || 'No due date'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Link to={`/todo?id=${id}`} className="btn-icon" title="View details page (?id=...)">
              <ExternalLink size={16} />
            </Link>
            <button onClick={() => onEdit(todo)} className="btn-icon" title="Edit Todo">
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(id)} className="btn-icon" title="Delete Todo" style={{ color: '#fca5a5' }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
