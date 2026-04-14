import React from 'react';
import { LayoutGrid, List, BarChart2, Zap } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  return (
    <nav className="glass sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
          <Zap size={16} />
        </div>
        <span className="font-semibold text-lg tracking-tight">
          Task<span className="text-indigo-400">Flow</span>
        </span>
        <span className="hidden sm:block text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          v1.0
        </span>
      </div>

      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
        <NavBtn
          active={currentView === 'board'}
          onClick={() => setView('board')}
          icon={<LayoutGrid size={15} />}
          label="Board"
        />
        <NavBtn
          active={currentView === 'list'}
          onClick={() => setView('list')}
          icon={<List size={15} />}
          label="Liste"
        />
        <NavBtn
          active={currentView === 'stats'}
          onClick={() => setView('stats')}
          icon={<BarChart2 size={15} />}
          label="İstatistik"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex -space-x-2">
          {['AK', 'MD', 'ZÇ', 'AY'].map((init, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-medium"
              style={{ backgroundColor: ['#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b'][i], zIndex: 4 - i }}
            >
              {init}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-gray-900 bg-white/10 flex items-center justify-center text-xs text-white/50">
            +4
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-indigo-500 text-white shadow-lg'
          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
