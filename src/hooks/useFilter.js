import { useState, useMemo } from 'react';

export function useFilter(tasks) {
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    tag: 'all',
    assignee: 'all',
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignee.toLowerCase().includes(filters.search.toLowerCase());

      const matchPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchTag = filters.tag === 'all' || task.tags.includes(filters.tag);
      const matchAssignee = filters.assignee === 'all' || task.assignee === filters.assignee;

      return matchSearch && matchPriority && matchTag && matchAssignee;
    });
  }, [tasks, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ search: '', priority: 'all', tag: 'all', assignee: 'all' });
  };

  const hasActiveFilters = filters.search || filters.priority !== 'all' ||
    filters.tag !== 'all' || filters.assignee !== 'all';

  return { filters, filteredTasks, updateFilter, resetFilters, hasActiveFilters };
}
