import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, PieChart } from 'lucide-react';

export const StatsSummary = ({ stats }) => {
  const { total = 0, completed = 0, pending = 0, highPriority = 0, completionRate = 0 } = stats || {};

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {/* Total Tasks Card */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Tasks</span>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.4rem', borderRadius: '8px', color: '#818cf8' }}>
            <PieChart size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{total}</div>
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            <span>Progress Rate</span>
            <span>{completionRate}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Pending Card */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Pending</span>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.4rem', borderRadius: '8px', color: '#fbbf24' }}>
            <Clock size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fbbf24' }}>{pending}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Tasks awaiting execution</p>
      </div>

      {/* Completed Card */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Completed</span>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem', borderRadius: '8px', color: '#34d399' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399' }}>{completed}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Tasks finished successfully</p>
      </div>

      {/* High Priority Card */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>High Priority</span>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.4rem', borderRadius: '8px', color: '#fca5a5' }}>
            <AlertTriangle size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fca5a5' }}>{highPriority}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Urgent active action items</p>
      </div>
    </div>
  );
};
