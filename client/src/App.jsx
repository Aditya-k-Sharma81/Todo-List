import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TodoListPage } from './pages/TodoListPage';
import { SingleTodoPage } from './pages/SingleTodoPage';
import { TodoModal } from './components/TodoModal';
import { api } from './services/api';

function AppContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateTodo = async (todoData) => {
    try {
      const res = await api.createTodo(todoData);
      setIsCreateModalOpen(false);

      // If created successfully, navigate to the newly created todo page
      if (res?.data?.id) {
        navigate(`/todo?id=${res.data.id}`);
      } else {
        setRefreshKey(prev => prev + 1);
        if (location.pathname !== '/') {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Error creating task. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenNewModal={() => setIsCreateModalOpen(true)} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<TodoListPage key={refreshKey} onOpenCreateModal={() => setIsCreateModalOpen(true)} />} />
          <Route path="/todo" element={<SingleTodoPage />} />
          <Route path="*" element={<TodoListPage key={refreshKey} onOpenCreateModal={() => setIsCreateModalOpen(true)} />} />
        </Routes>
      </main>

      {/* Global Create Task Modal - Accessible from all routes including /todo */}
      <TodoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTodo}
        initialTodo={null}
      />
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
