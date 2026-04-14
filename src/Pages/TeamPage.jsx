import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getInitials, getAvatarColor } from '../utils/helpers';
import { Trash2, UserPlus } from 'lucide-react';

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'members'), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await addDoc(collection(db, 'members'), { name, email });
    setName('');
    setEmail('');
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'members', id));
  };

  return (
    <div className="p-4 sm:p-6 max-w-[800px] mx-auto">
      <h2 className="text-lg font-semibold mb-6" style={{ color: '#3d2010' }}>Ekip Yönetimi</h2>

      {/* Üye ekle formu */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(61,32,16,0.6)' }}>Yeni Üye Ekle</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="input-dark flex-1 px-3 py-2 rounded-xl text-sm"
          />
          <input
            type="email"
            placeholder="Email (opsiyonel)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-dark flex-1 px-3 py-2 rounded-xl text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap"
          >
            <UserPlus size={15} />
            {loading ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </form>
      </div>

      {/* Üye listesi */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {members.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'rgba(61,32,16,0.25)' }}>
            <div className="text-4xl mb-2">👥</div>
            <p className="text-sm">Henüz ekip üyesi yok</p>
          </div>
        ) : (
          <div>
            {members.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: i < members.length - 1 ? '1px solid rgba(200,140,100,0.12)' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ backgroundColor: getAvatarColor(m.name) }}
                  >
                    {getInitials(m.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3d2010' }}>{m.name}</p>
                    {m.email && <p className="text-xs" style={{ color: 'rgba(61,32,16,0.4)' }}>{m.email}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: 'rgba(61,32,16,0.3)' }}
                  onMouseEnter={e => e.target.style.color = '#c0392b'}
                  onMouseLeave={e => e.target.style.color = 'rgba(61,32,16,0.3)'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}