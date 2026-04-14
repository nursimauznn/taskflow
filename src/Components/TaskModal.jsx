import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { PRIORITIES, TAGS, STATUSES } from '../Interfaces';
import { useTaskContext } from '../context/TaskContext';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  tags: [],
  assignee: '',
  dueDate: '',
};

export default function TaskModal({ task, onSave, onClose }) {
  const { members } = useTaskContext();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        tags: task.tags || [],
        assignee: task.assignee || '',
        dueDate: task.dueDate || '',
      });
    }
  }, [task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Başlık zorunludur';
    if (!form.assignee) e.assignee = 'Atanan kişi seçin';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(isEdit ? { ...task, ...form } : form);
  };

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg glass rounded-2xl shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(200,140,100,0.15)' }}>
          <h2 className="font-semibold text-base" style={{ color: '#3d2010' }}>
            {isEdit ? '✏️ Görevi Düzenle' : '➕ Yeni Görev'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl transition-all" style={{ color: 'rgba(61,32,16,0.4)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(61,32,16,0.5)' }}>
              Başlık <span style={{ color: '#c0392b' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Görev başlığını girin..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="input-dark w-full px-3 py-2 rounded-xl text-sm"
            />
            {errors.title && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(61,32,16,0.5)' }}>Açıklama</label>
            <textarea
              placeholder="Görevi detaylıca açıklayın..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-dark w-full px-3 py-2 rounded-xl text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(61,32,16,0.5)' }}>Durum</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-dark w-full px-3 py-2 rounded-xl text-sm cursor-pointer">
                {Object.entries(STATUSES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(61,32,16,0.5)' }}>Öncelik</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input-dark w-full px-3 py-2 rounded-xl text-sm cursor-pointer">
                {Object.entries(PRIORITIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(61,32,16,0.5)' }}>
                Atanan Kişi <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="input-dark w-full px-3 py-2 rounded-xl text-sm cursor-pointer">
                <option value="">Kişi seçin</option>
                {members.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
              {errors.assignee && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors.assignee}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(61,32,16,0.5)' }}>Bitiş Tarihi</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(61,32,16,0.5)' }}>Etiketler</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TAGS).map(([key, val]) => {
                const selected = form.tags.includes(key);
                return (
                  <button key={key} type="button" onClick={() => toggleTag(key)} className="tag-pill border transition-all"
                    style={{ background: selected ? val.bg : 'rgba(200,140,100,0.08)', color: selected ? val.color : 'rgba(61,32,16,0.4)', borderColor: selected ? val.color + '60' : 'rgba(200,140,100,0.2)' }}>
                    {selected && '✓ '}{val.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm border transition-all" style={{ color: 'rgba(61,32,16,0.5)', borderColor: 'rgba(200,140,100,0.2)' }}>
              İptal
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium">
              {isEdit ? <Save size={15} /> : <Plus size={15} />}
              {isEdit ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}