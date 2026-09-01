import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, PlusCircle, ListTodo, Sparkles } from 'lucide-react';

export const Navbar = ({ onOpenNewModal }) => {
  const location = useLocation();
  const isSinglePage = location.pathname === '/todo';

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, marginBottom: '2rem', sticky: 'top' }}>
      <div className="app-container" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <CheckSquare size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', lineHeight: 1.2, margin: 0 }} className="gradient-text">TaskPulse</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Full-Stack MERN Todo App</p>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            className={`btn ${!isSinglePage ? 'btn-secondary' : 'btn-icon'}`}
            style={{
              background: !isSinglePage ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: !isSinglePage ? 'rgba(99, 102, 241, 0.4)' : 'transparent',
              color: !isSinglePage ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            <ListTodo size={18} />
            <span>Todos List</span>
          </Link>

          <button onClick={onOpenNewModal} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>New Task</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
