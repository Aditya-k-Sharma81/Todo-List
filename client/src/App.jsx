import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TodoListPage } from './pages/TodoListPage';
import { SingleTodoPage } from './pages/SingleTodoPage';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar onOpenNewModal={() => setIsModalOpen(true)} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<TodoListPage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />} />
            <Route path="/todo" element={<SingleTodoPage />} />
            <Route path="*" element={<TodoListPage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
