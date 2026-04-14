import React from 'react';
import { Clock, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { PRIORITIES, TAGS } from '../Interfaces';
import { formatDate, isOverdue, getDaysUntil, getInitials, getAvatarColor } from '../utils/helpers';

export default function TaskCard({ task, onEdit, onDelete, onDragStart }) {
  const priority = PRIORITIES[task.priority];
  const overdue = isOverdue(task.dueDate, task.status);
  const daysUntil = getDaysUntil(task.dueDate);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
    e.currentTarget.classList.add('task-card-dragging');
    onDragStart?.();
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('task-card-dragging');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="glass-card rounded-2xl p-4 cursor-grab active:cursor-grabbing animate-slide-in"
    >
      {/* Üst satır: öncelik + aksiyon */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`tag-pill border ${priority.bgClass} ${priority.textClass}`}
          style={{ border: '1px solid' }}
        >
          {priority.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-indigo-400 transition-all"
            title="Düzenle"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-all"
            title="Sil"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Başlık */}
      <h3 className={`text-sm font-medium mb-2 leading-snug ${task.status === 'done' ? 'line-through text-white/40' : 'text-white/90'}`}>
        {task.title}
      </h3>

      {/* Açıklama */}
      {task.description && (
        <p className="text-xs text-white/35 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Etiketler */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => {
            const t = TAGS[tag];
            return t ? (
              <span
                key={tag}
                className="tag-pill"
                style={{ background: t.bg, color: t.color }}
              >
                {t.label}
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Alt satır: kişi + tarih */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ backgroundColor: getAvatarColor(task.assignee) }}
          >
            {getInitials(task.assignee)}
          </div>
          <span className="text-xs text-white/40 truncate max-w-[80px]">
            {task.assignee.split(' ')[0]}
          </span>
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : daysUntil !== null && daysUntil <= 3 ? 'text-amber-400' : 'text-white/35'}`}>
            {overdue && <AlertCircle size={11} />}
            {!overdue && <Clock size={11} />}
            <span>{overdue ? 'Gecikti' : daysUntil === 0 ? 'Bugün' : daysUntil === 1 ? 'Yarın' : formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      
    </div>
  );
}
