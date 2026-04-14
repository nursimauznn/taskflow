import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { PRIORITIES, TAGS, STATUSES } from '../Interfaces';
import { getAvatarColor, getInitials } from '../utils/helpers';

function ProgressBar({ value, max, color, label, count }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs" style={{ color: 'rgba(61,32,16,0.5)' }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color: 'rgba(61,32,16,0.7)' }}>{count}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(200,140,100,0.15)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 140 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <div className="text-sm text-center py-8" style={{ color: 'rgba(61,32,16,0.2)' }}>Veri yok</div>;

  let cumPct = 0;
  const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.22;

  const polarToCart = (pct) => {
    const angle = (pct * 360 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };
  const polarInner = (pct) => {
    const angle = (pct * 360 - 90) * (Math.PI / 180);
    return { x: cx + inner * Math.cos(angle), y: cy + inner * Math.sin(angle) };
  };

  const paths = segments.map((seg) => {
    const startPct = cumPct;
    const endPct = cumPct + seg.value / total;
    cumPct = endPct;
    if (seg.value === 0) return null;
    const s1 = polarToCart(startPct), e1 = polarToCart(endPct);
    const s2 = polarInner(endPct), e2 = polarInner(startPct);
    const large = endPct - startPct > 0.5 ? 1 : 0;
    const d = [`M ${s1.x} ${s1.y}`, `A ${r} ${r} 0 ${large} 1 ${e1.x} ${e1.y}`, `L ${s2.x} ${s2.y}`, `A ${inner} ${inner} 0 ${large} 0 ${e2.x} ${e2.y}`, 'Z'].join(' ');
    return <path key={seg.label} d={d} fill={seg.color} opacity="0.85" />;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(61,32,16,0.8)" fontSize="20" fontWeight="600">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(61,32,16,0.3)" fontSize="9">Toplam</text>
    </svg>
  );
}

export default function StatsPage() {
  const { tasks, members } = useTaskContext();

  const byStatus = Object.entries(STATUSES).map(([key, val]) => ({
    label: val.label, value: tasks.filter(t => t.status === key).length, color: val.color,
  }));

  const byPriority = Object.entries(PRIORITIES).map(([key, val]) => ({
    label: val.label, value: tasks.filter(t => t.priority === key).length, color: val.color,
  }));

  const byTag = Object.entries(TAGS).map(([key, val]) => ({
    label: val.label, value: tasks.filter(t => t.tags?.includes(key)).length, color: val.color,
  })).filter(t => t.value > 0);

  const memberStats = members.map(m => ({
    name: m.name,
    total: tasks.filter(t => t.assignee === m.name).length,
    done: tasks.filter(t => t.assignee === m.name && t.status === 'done').length,
  })).filter(m => m.total > 0).sort((a, b) => b.total - a.total);

  const now = new Date();
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 max-w-[1200px] mx-auto">
      <h2 className="text-lg font-semibold mb-6" style={{ color: '#3d2010' }}>Proje İstatistikleri</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Toplam Görev', value: tasks.length, emoji: '📋', color: '#d4714e' },
          { label: 'Tamamlanma', value: `${completionRate}%`, emoji: '🎯', color: '#2d8a5e' },
          { label: 'Gecikmiş', value: overdue, emoji: '⚠️', color: overdue > 0 ? '#c0392b' : 'rgba(61,32,16,0.3)' },
          { label: 'Ekip Üyesi', value: members.length, emoji: '👥', color: '#2563a8' },
        ].map((c, i) => (
          <div key={i} className="stat-card rounded-2xl p-4">
            <div className="text-2xl mb-1">{c.emoji}</div>
            <div className="text-2xl font-semibold" style={{ color: c.color }}>{c.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(61,32,16,0.35)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="stat-card rounded-2xl p-5">
          <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(61,32,16,0.6)' }}>Durum Dağılımı</h3>
          <div className="flex items-center gap-6">
            <DonutChart segments={byStatus} size={120} />
            <div className="flex-1 space-y-2">
              {byStatus.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs" style={{ color: 'rgba(61,32,16,0.5)' }}>{s.label}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'rgba(61,32,16,0.7)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card rounded-2xl p-5">
          <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(61,32,16,0.6)' }}>Öncelik Dağılımı</h3>
          <div className="flex items-center gap-6">
            <DonutChart segments={byPriority} size={120} />
            <div className="flex-1 space-y-2">
              {byPriority.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs" style={{ color: 'rgba(61,32,16,0.5)' }}>{s.label}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'rgba(61,32,16,0.7)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card rounded-2xl p-5">
          <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(61,32,16,0.6)' }}>Etiket Dağılımı</h3>
          {byTag.length === 0 ? (
            <p className="text-xs" style={{ color: 'rgba(61,32,16,0.2)' }}>Etiket yok</p>
          ) : (
            byTag.map(t => (
              <ProgressBar key={t.label} label={t.label} value={t.value} max={tasks.length} color={t.color} count={t.value} />
            ))
          )}
        </div>
      </div>

      <div className="stat-card rounded-2xl p-5">
        <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(61,32,16,0.6)' }}>Ekip Performansı</h3>
        {memberStats.length === 0 ? (
          <p className="text-sm" style={{ color: 'rgba(61,32,16,0.2)' }}>Görev atanmış üye yok</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {memberStats.map(m => {
              const rate = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0;
              return (
                <div key={m.name} className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: getAvatarColor(m.name) }}>
                      {getInitials(m.name)}
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: '#3d2010' }}>{m.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(61,32,16,0.35)' }}>{m.total} görev</p>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(200,140,100,0.15)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rate}%`, backgroundColor: getAvatarColor(m.name) }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: 'rgba(61,32,16,0.3)' }}>{m.done} tamamlandı</span>
                    <span className="text-xs font-semibold" style={{ color: getAvatarColor(m.name) }}>{rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}