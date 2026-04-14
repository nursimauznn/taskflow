import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PRIORITIES, TAGS, TEAM_MEMBERS } from '../Interfaces';

export default function FilterBar({ filters, updateFilter, resetFilters, hasActiveFilters, onAddTask }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Arama */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Görev veya kişi ara..."
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          className="input-dark w-full pl-9 pr-3 py-2 rounded-xl text-sm"
        />
      </div>

      {/* Öncelik filtresi */}
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

      {/* Etiket filtresi */}
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

      {/* Kişi filtresi */}
      <select
        value={filters.assignee}
        onChange={e => updateFilter('assignee', e.target.value)}
        className="input-dark px-3 py-2 rounded-xl text-sm cursor-pointer"
      >
        <option value="all">Tüm Ekip</option>
        {TEAM_MEMBERS.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Filtreleri temizle */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all"
        >
          <X size={14} />
          Temizle
        </button>
      )}

      {/* Görev ekle */}
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
