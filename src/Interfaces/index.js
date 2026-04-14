/**
 * TaskFlow - Interface / Type Definitions
 * Bu dosya tüm veri modellerini tanımlar.
 */

/**
 * @typedef {'todo' | 'in-progress' | 'review' | 'done'} Status
 * @typedef {'critical' | 'high' | 'medium' | 'low'} Priority
 * @typedef {'bug' | 'feature' | 'improvement' | 'documentation' | 'design'} Tag
 *
 * @typedef {Object} Task
 * @property {string} id - Benzersiz görev ID (uuid)
 * @property {string} title - Görev başlığı
 * @property {string} description - Görev açıklaması
 * @property {Status} status - Görev durumu
 * @property {Priority} priority - Öncelik seviyesi
 * @property {Tag[]} tags - Etiketler
 * @property {string} assignee - Atanan kişi
 * @property {string} dueDate - Bitiş tarihi (ISO string)
 * @property {string} createdAt - Oluşturulma tarihi (ISO string)
 * @property {string} updatedAt - Güncellenme tarihi (ISO string)
 *
 * @typedef {Object} FilterState
 * @property {string} search - Arama metni
 * @property {Priority | 'all'} priority - Öncelik filtresi
 * @property {Tag | 'all'} tag - Etiket filtresi
 * @property {string} assignee - Atanan kişi filtresi
 *
 * @typedef {Object} Stats
 * @property {number} total - Toplam görev
 * @property {number} todo - Yapılacak
 * @property {number} inProgress - Devam eden
 * @property {number} review - İncelemede
 * @property {number} done - Tamamlanan
 * @property {number} overdue - Süresi geçmiş
 */

export const STATUSES = {
  todo: { label: 'Yapılacak', color: '#64748b' },
  'in-progress': { label: 'Devam Ediyor', color: '#6366f1' },
  review: { label: 'İncelemede', color: '#f59e0b' },
  done: { label: 'Tamamlandı', color: '#10b981' },
};

export const PRIORITIES = {
  critical: { label: 'Kritik', color: '#f87171', bgClass: 'priority-bg-critical', textClass: 'priority-critical' },
  high: { label: 'Yüksek', color: '#fb923c', bgClass: 'priority-bg-high', textClass: 'priority-high' },
  medium: { label: 'Orta', color: '#fbbf24', bgClass: 'priority-bg-medium', textClass: 'priority-medium' },
  low: { label: 'Düşük', color: '#34d399', bgClass: 'priority-bg-low', textClass: 'priority-low' },
};

export const TAGS = {
  bug: { label: 'Bug', bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
  feature: { label: 'Özellik', bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
  improvement: { label: 'İyileştirme', bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7' },
  documentation: { label: 'Dokümantasyon', bg: 'rgba(245,158,11,0.15)', color: '#fcd34d' },
  design: { label: 'Tasarım', bg: 'rgba(236,72,153,0.15)', color: '#f9a8d4' },
};

export const TEAM_MEMBERS = [
  'Ayşe Kaya', 'Mehmet Demir', 'Zeynep Çelik', 'Ali Yıldız',
  'Fatma Şahin', 'Emre Arslan', 'Selin Güneş', 'Can Koç',
];

export const COLUMN_ORDER = ['todo', 'in-progress', 'review', 'done'];
