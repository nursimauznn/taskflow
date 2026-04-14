import React from 'react';
import { Search, X } from 'lucide-react';
import { PRIORITIES, TAGS } from '../Interfaces';
import { useTaskContext } from '../context/TaskContext';

export default function FilterBar({ filters, updateFilter, resetFilters, hasActiveFilters, onAddTask }) {
  const { members } = useTaskContext();

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(61,32,16,0.3)' }} />
        <input
          type="text"
          placeholder="Görev veya kişi ara..."
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          className="input-dark w-full pl-9 pr-3 py-2 rounded-xl text-sm"
        />
      </div>

      <select
        value={filters.priority}
        onChange={e => updateFilter('priority', e.target.value)}
        className="input-dark px-3 py-2 rounded-xl text-sm cursor-pointer"
      >
        <option value="all">Tüm Öncelikler</option>
        {Object.entries(PRIORITIES).map(([key, val]) => (
          <option key={key} value={key}>{val.label}</option>
        ))}
      </select>

      <select
        value={filters.tag}
        onChange={e => updateFilter('tag', e.target.value)}
        className="input-dark px-3 py-2 rounded-xl text-sm cursor-pointer"
      >
        <option value="all">Tüm Etiketler</option>
        {Object.entries(TAGS).map(([key, val]) => (
          <option key={key} value={key}>{val.label}</option>
        ))}
      </select>

      <select
        value={filters.assignee}
        onChange={e => updateFilter('assignee', e.target.value)}
        className="input-dark px-3 py-2 rounded-xl text-sm cursor-pointer"
      >
        <option value="all">Tüm Ekip</option>
        {members.map(m => (
          <option key={m.id} value={m.name}>{m.name}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all"
          style={{ color: 'rgba(61,32,16,0.5)', borderColor: 'rgba(200,140,100,0.2)' }}
        >
          <X size={14} />
          Temizle
        </button>
      )}

      <button
        onClick={onAddTask}
        className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ml-auto"
      >
        <span>+</span>
        <span>Yeni Görev</span>
      </button>
    </div>
  );
}