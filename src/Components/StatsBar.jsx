import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

export default function StatsBar({ stats }) {
  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const cards = [
    { label: 'Toplam Görev', value: stats.total, icon: <Layers size={16} />, color: 'text-indigo-400', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Devam Ediyor', value: stats.inProgress, icon: <Clock size={16} />, color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Tamamlanan', value: stats.done, icon: <CheckCircle2 size={16} />, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Gecikmiş', value: stats.overdue, icon: <AlertTriangle size={16} />, color: stats.overdue > 0 ? 'text-red-400' : 'text-white/30', bg: stats.overdue > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)' },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {cards.map((card, i) => (
          <div key={i} className="stat-card rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
              <span className={card.color}>{card.icon}</span>
            </div>
            <div>
              <p className="text-xl font-semibold">{card.value}</p>
              <p className="text-xs text-white/35">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* İlerleme çubuğu */}
      <div className="stat-card rounded-2xl px-5 py-3 flex items-center gap-4">
        <span className="text-xs text-white/40 whitespace-nowrap">Tamamlanma</span>
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completionRate}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)',
            }}
          />
        </div>
        <span className="text-sm font-semibold text-indigo-400 min-w-[36px] text-right">
          {completionRate}%
        </span>
      </div>
    </div>
  );
}
