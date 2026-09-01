import React from 'react';
import { Search, Filter, ArrowUpDown, LayoutGrid, List } from 'lucide-react';

export const FilterBar = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange
}) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search tasks by title or description..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          {['all', 'active', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => handleInputChange('status', st)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.825rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
                background: filters.status === st ? 'var(--accent-primary)' : 'transparent',
                color: filters.status === st ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Priority */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={filters.priority || 'all'}
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category */}
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            value={filters.category || 'all'}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Shopping">Shopping</option>
          </select>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={filters.sortBy || 'newest'}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority Rank</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '0.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginLeft: 'auto' }}>
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className="btn-icon"
              style={{ color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)', padding: '0.35rem' }}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="List View"
              className="btn-icon"
              style={{ color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-muted)', padding: '0.35rem' }}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
