import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useFilter } from '../hooks/useFilter';
import { STATUSES, COLUMN_ORDER } from '../Interfaces';
import TaskCard from '../Components/TaskCard';
import FilterBar from '../Components/FilterBar';
import StatsBar from '../Components/StatsBar';
import TaskModal from '../Components/TaskModal';
import ConfirmDialog from '../Components/ConfirmDialog';

export default function BoardPage() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, getStats } = useTaskContext();
  const { filters, filteredTasks, updateFilter, resetFilters, hasActiveFilters } = useFilter(tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const stats = getStats();

  const handleSave = (data) => {
    if (editingTask) {
      updateTask(data);
    } else {
      addTask(data);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    const task = tasks.find(t => t.id === id);
    setDeleteConfirm(task);
  };

  const confirmDelete = () => {
    deleteTask(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) moveTask(taskId, status);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const getColumnTasks = (status) =>
    filteredTasks.filter(t => t.status === status);

  const columnColors = {
    'todo': 'border-slate-500/30',
    'in-progress': 'border-indigo-500/30',
    'review': 'border-amber-500/30',
    'done': 'border-emerald-500/30',
  };

  const columnDotColors = {
    'todo': 'bg-slate-400',
    'in-progress': 'bg-indigo-400',
    'review': 'bg-amber-400',
    'done': 'bg-emerald-400',
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      <StatsBar stats={stats} />

      <FilterBar
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        onAddTask={() => { setEditingTask(null); setModalOpen(true); }}
      />

      {/* Kanban Kolonları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMN_ORDER.map(status => {
          const colTasks = getColumnTasks(status);
          const info = STATUSES[status];
          const isOver = dragOverColumn === status;

          return (
            <div
              key={status}
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={() => setDragOverColumn(null)}
              className={`kanban-column rounded-2xl p-3 transition-all min-h-[500px] ${columnColors[status]} ${isOver ? 'drag-over' : ''}`}
            >
              {/* Kolon Başlığı */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${columnDotColors[status]}`} />
                  <span className="text-sm font-medium text-white/70">{info.label}</span>
                </div>
                <span className="text-xs font-semibold bg-white/8 text-white/40 px-2 py-0.5 rounded-full border border-white/10">
                  {colTasks.length}
                </span>
              </div>

              {/* Görev Kartları */}
              <div className="space-y-2.5 group">
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/20">
                    <div className="text-3xl mb-2">
                      {status === 'todo' ? '📋' : status === 'in-progress' ? '⚡' : status === 'review' ? '🔍' : '✅'}
                    </div>
                    <p className="text-xs">Görev yok</p>
                    {isOver && <p className="text-xs text-indigo-400 mt-1">Buraya bırak</p>}
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>

              {/* Hızlı ekle butonu */}
              <button
                onClick={() => { setEditingTask({ status }); setModalOpen(true); }}
                className="w-full mt-3 py-2 rounded-xl text-xs text-white/25 hover:text-white/50 hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20 transition-all"
              >
                + Görev ekle
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask?.id ? editingTask : (editingTask?.status ? { status: editingTask.status } : null)}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
        />
      )}

      {/* Silme Onayı */}
      {deleteConfirm && (
        <ConfirmDialog
          message={`"${deleteConfirm.title}" görevi kalıcı olarak silinecek.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
