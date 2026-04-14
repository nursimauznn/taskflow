import React, { useState } from 'react';
import { TaskProvider } from "./context/TaskContext";import Navbar from './Components/Navbar';
import BoardPage from './Pages/BoardPage';
import ListPage from './Pages/ListPage';
import StatsPage from './Pages/StatsPage';

export default function App() {
  const [view, setView] = useState('board');
  return (
    <TaskProvider>
      <div className="min-h-screen">
        <Navbar currentView={view} setView={setView} />
        <main>
          {view === 'board' && <BoardPage />}
          {view === 'list' && <ListPage />}
          {view === 'stats' && <StatsPage />}
        </main>
      </div>
    </TaskProvider>
  );
}
