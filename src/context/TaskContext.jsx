import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext(null);

const STORAGE_KEY = 'taskflow_tasks';

const INITIAL_TASKS = [
  {
    id: uuidv4(), title: 'Kullanıcı kimlik doğrulama akışı tasarla',
    description: 'OAuth2 ve JWT token kullanarak güvenli giriş sistemi oluştur. Refresh token mekanizması dahil edilmeli.',
    status: 'in-progress', priority: 'critical', tags: ['feature', 'design'],
    assignee: 'Ayşe Kaya', dueDate: '2025-04-20',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), title: 'Dashboard bileşenlerini optimize et',
    description: 'React.memo ve useMemo kullanarak gereksiz render\'ları azalt.',
    status: 'review', priority: 'high', tags: ['improvement'],
    assignee: 'Mehmet Demir', dueDate: '2025-04-18',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), title: 'API endpoint dokümantasyonu yaz',
    description: 'Swagger/OpenAPI formatında tüm endpoint\'leri dokümante et.',
    status: 'todo', priority: 'medium', tags: ['documentation'],
    assignee: 'Zeynep Çelik', dueDate: '2025-04-25',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), title: 'Mobil navigasyon menüsü düzelt',
    description: 'iOS Safari\'de hamburger menü açılmıyor. Touch event handler güncellenmeli.',
    status: 'todo', priority: 'high', tags: ['bug'],
    assignee: 'Ali Yıldız', dueDate: '2025-04-15',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), title: 'Ödeme entegrasyonu tamamla',
    description: 'Stripe webhook\'larını test et ve production\'a al.',
    status: 'done', priority: 'critical', tags: ['feature'],
    assignee: 'Fatma Şahin', dueDate: '2025-04-10',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), title: 'E-posta bildirim sistemi kur',
    description: 'Nodemailer ile SMTP yapılandırması ve şablonlar hazırla.',
    status: 'in-progress', priority: 'medium', tags: ['feature'],
    assignee: 'Emre Arslan', dueDate: '2025-04-22',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), title: 'Unit test coverage %80\'e çıkar',
    description: 'Jest ve React Testing Library kullanarak kritik bileşenleri test et.',
    status: 'todo', priority: 'low', tags: ['improvement'],
    assignee: 'Selin Güneş', dueDate: '2025-05-01',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), title: 'Dark mode tema entegrasyonu',
    description: 'CSS custom properties ile sistem teması otomatik algılama.',
    status: 'done', priority: 'low', tags: ['design', 'improvement'],
    assignee: 'Can Koç', dueDate: '2025-04-08',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [action.payload, ...state];

    case 'UPDATE_TASK':
      return state.map(t =>
        t.id === action.payload.id
          ? { ...action.payload, updatedAt: new Date().toISOString() }
          : t
      );

    case 'DELETE_TASK':
      return state.filter(t => t.id !== action.payload);

    case 'MOVE_TASK':
      return state.map(t =>
        t.id === action.payload.id
          ? { ...t, status: action.payload.status, updatedAt: new Date().toISOString() }
          : t
      );

    case 'SET_TASKS':
      return action.payload;

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const initial = stored ? JSON.parse(stored) : INITIAL_TASKS;
  const [tasks, dispatch] = useReducer(taskReducer, initial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    return newTask;
  };

  const updateTask = (task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const moveTask = (id, status) => {
    dispatch({ type: 'MOVE_TASK', payload: { id, status } });
  };

  const getStats = () => {
    const now = new Date();
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length,
    };
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask, getStats }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used inside TaskProvider');
  return ctx;
}
