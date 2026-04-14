import React, { useState } from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { useFilter } from '../hooks/useFilter';
import { STATUSES, PRIORITIES, TAGS } from '../Interfaces';
import FilterBar from '../Components/FilterBar';
import TaskModal from '../Components/TaskModal';
import ConfirmDialog from '../Components/ConfirmDialog';
import { formatDate, isOverdue, getInitials, getAvatarColor } from '../utils/helpers';

export default function ListPage() {
  const { tasks, addTask, updateTask, deleteTask, getStats } = useTaskContext();
  const { filters, filteredTasks, updateFilter, resetFilters, hasActiveFilters } = useFilter(tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const statusOrder = { 'todo': 0, 'in-progress': 1, 'review': 2, 'done': 3 };

  const sorted = [...filteredTasks].sort((a, b) => {
    let valA, valB;
    if (sortField === 'priority') { valA = priorityOrder[a.priority]; valB = priorityOrder[b.priority]; }
    else if (sortField === 'status') { valA = statusOrder[a.status]; valB = statusOrder[b.status]; }
    else if (sortField === 'dueDate') { valA = a.dueDate || '9999'; valB = b.dueDate || '9999'; }
    else { valA = a[sortField] || ''; valB = b[sortField] || ''; }
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-white/20" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-indigo-400" />
      : <ChevronDown size={12} className="text-indigo-400" />;
  };

  const handleSave = (data) => {
    editingTask?.id ? updateTask(data) : addTask(data);
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <FilterBar
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        onAddTask={() => { setEditingTask(null); setModalOpen(true); }}
      />

      {/* Tablo */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left">
                {[
                  { key: 'title', label: 'Görev' },
                  { key: 'status', label: 'Durum' },
                  { key: 'priority', label: 'Öncelik' },
                  { key: 'assignee', label: 'Atanan' },
                  { key: 'dueDate', label: 'Bitiş' },
                  { key: 'tags', label: 'Etiket', noSort: true },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => !col.noSort && handleSort(col.key)}
                    className={`px-4 py-3 text-xs font-medium text-white/40 ${!col.noSort ? 'cursor-pointer hover:text-white/60 select-none' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {!col.noSort && <SortIcon field={col.key} />}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-medium text-white/40 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-white/25 text-sm">
                    Görev bulunamadı
                  </td>
                </tr>
              ) : (
                sorted.map((task, i) => {
                  const priority = PRIORITIES[task.priority];
                  const status = STATUSES[task.status];
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <tr
                      key={task.id}
                      className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}
                    >
                      {/* Başlık */}
                      <td className="px-4 py-3 max-w-[280px]">
                        <span className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-white/30' : 'text-white/85'}`}>
                          {task.title}
                        </span>
                        {task.description && (
                          <p className="text-xs text-white/30 truncate mt-0.5">{task.description}</p>
                        )}
                      </td>

                      {/* Durum */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="tag-pill border text-xs"
                          style={{
                            background: status.color + '20',
                            color: status.color,
                            borderColor: status.color + '40',
                          }}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Öncelik */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`tag-pill border ${priority.bgClass} ${priority.textClass}`} style={{ border: '1px solid' }}>
                          {priority.label}
                        </span>
                      </td>

                      {/* Atanan */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                            style={{ backgroundColor: getAvatarColor(task.assignee) }}
                          >
                            {getInitials(task.assignee)}
                          </div>
                          <span className="text-xs text-white/60 truncate max-w-[100px]">{task.assignee}</span>
                        </div>
                      </td>

                      {/* Bitiş */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-white/40'}`}>
                          {overdue && <AlertCircle size={12} />}
                          {formatDate(task.dueDate)}
                        </div>
                      </td>

                      {/* Etiketler */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {task.tags?.slice(0, 2).map(tag => {
                            const t = TAGS[tag];
                            return t ? (
                              <span key={tag} className="tag-pill" style={{ background: t.bg, color: t.color }}>
                                {t.label}
                              </span>
                            ) : null;
                          })}
                          {task.tags?.length > 2 && (
                            <span className="tag-pill bg-white/5 text-white/30">+{task.tags.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* İşlemler */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingTask(task); setModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-indigo-400 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(task)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/8 flex items-center justify-between">
          <span className="text-xs text-white/30">{sorted.length} görev gösteriliyor</span>
          <span className="text-xs text-white/20">Sütun başlığına tıklayarak sıralama yapabilirsiniz</span>
        </div>
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
        />
      )}
      {deleteConfirm && (
        <ConfirmDialog
          message={`"${deleteConfirm.title}" görevi kalıcı olarak silinecek.`}
          onConfirm={() => { deleteTask(deleteConfirm.id); setDeleteConfirm(null); }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
