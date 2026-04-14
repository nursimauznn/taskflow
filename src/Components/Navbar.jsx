import React from 'react';
import { LayoutGrid, List, BarChart2, Zap, Users } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  return (
    <nav className="glass sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
          <Zap size={16} />
        </div>
        <span className="font-semibold text-lg tracking-tight" style={{ color: '#3d2010' }}>
          Task<span style={{ color: '#d4714e' }}>Flow</span>
        </span>
        <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full border" style={{ color: 'rgba(61,32,16,0.3)', borderColor: 'rgba(200,140,100,0.2)', background: 'rgba(200,140,100,0.08)' }}>
          v1.0
        </span>
      </div>

      <div className="flex items-center gap-1 rounded-xl p-1 border" style={{ background: 'rgba(200,140,100,0.08)', borderColor: 'rgba(200,140,100,0.2)' }}>
        <NavBtn active={currentView === 'board'} onClick={() => setView('board')} icon={<LayoutGrid size={15} />} label="Board" />
        <NavBtn active={currentView === 'list'} onClick={() => setView('list')} icon={<List size={15} />} label="Liste" />
        <NavBtn active={currentView === 'stats'} onClick={() => setView('stats')} icon={<BarChart2 size={15} />} label="İstatistik" />
        <NavBtn active={currentView === 'team'} onClick={() => setView('team')} icon={<Users size={15} />} label="Ekip" />
      </div>

      <div style={{ width: '120px' }} />
    </nav>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={active
        ? { background: '#d4714e', color: 'white' }
        : { color: 'rgba(61,32,16,0.5)' }
      }
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}