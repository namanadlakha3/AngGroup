import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Shield, ShieldOff, Users, Check, AlertCircle,
  X, Loader2, ChevronDown, Mail, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

type ToastType = 'success' | 'error';
interface Toast { id: number; message: string; type: ToastType; }

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium max-w-sm ${
              t.type === 'success'
                ? 'bg-white/95 border-green-200 text-green-800'
                : 'bg-white/95 border-red-200 text-red-800'
            }`}
          >
            {t.type === 'success'
              ? <Check size={16} className="text-green-600 shrink-0" />
              : <AlertCircle size={16} className="text-red-500 shrink-0" />
            }
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
      role === 'admin'
        ? 'bg-gold/10 text-amber-800 border-gold/30'
        : 'bg-gray-100 text-gray-600 border-gray-200'
    }`}>
      {role === 'admin' ? <Shield size={10} /> : <Users size={10} />}
      {role}
    </span>
  );
}

function Avatar({ email }: { email: string }) {
  const initials = email.charAt(0).toUpperCase();
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ];
  const color = colors[email.charCodeAt(0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    if (userId === currentUser?.id) {
      addToast("You can't change your own role.", 'error');
      return;
    }
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdatingId(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    setUpdatingId(null);

    if (error) {
      addToast('Failed to update role: ' + error.message, 'error');
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      addToast(`User role updated to "${newRole}".`);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <>
      <ToastContainer toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />

      <div className="space-y-4">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'text-charcoal' },
            { label: 'Admins', value: adminCount, icon: Shield, color: 'text-gold' },
            { label: 'Regular Users', value: users.length - adminCount, icon: Users, color: 'text-charcoal-muted' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <stat.icon size={18} className={stat.color} />
              <div>
                <div className="text-xl font-bold text-charcoal">{stat.value}</div>
                <div className="text-xs text-charcoal-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="search-wrap flex-1 max-w-sm">
            <Search size={15} className="search-icon" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email..."
              className="form-input text-sm"
              style={{ paddingTop: '10px', paddingBottom: '10px' }}
            />
          </div>
          <div className="relative shrink-0">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="form-input appearance-none text-sm"
              style={{ paddingTop: '10px', paddingBottom: '10px', paddingRight: '32px' }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins only</option>
              <option value="user">Users only</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-charcoal-muted">
              <Loader2 size={20} className="animate-spin text-gold" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5 hidden sm:table-cell">Joined</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gold/[0.02] transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar email={u.email} />
                          <div>
                            <div className="text-sm font-semibold text-charcoal flex items-center gap-2">
                              <Mail size={12} className="text-charcoal-muted" />
                              {u.email}
                              {u.id === currentUser?.id && (
                                <span className="text-xs bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded font-medium">You</span>
                              )}
                            </div>
                            <div className="text-xs text-charcoal-muted mt-0.5 font-mono">
                              {u.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><RoleBadge role={u.role} /></td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
                          <Calendar size={12} />
                          {new Date(u.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {u.id === currentUser?.id ? (
                          <span className="text-xs text-charcoal-muted italic">Current session</span>
                        ) : (
                          <button
                            onClick={() => toggleRole(u.id, u.role)}
                            disabled={updatingId === u.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                              u.role === 'admin'
                                ? 'text-red-600 border-red-200 hover:bg-red-50 bg-white'
                                : 'text-amber-700 border-amber-200 hover:bg-amber-50 bg-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {updatingId === u.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : u.role === 'admin' ? (
                              <ShieldOff size={12} />
                            ) : (
                              <Shield size={12} />
                            )}
                            {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <Users size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-charcoal-muted">
                          {search || roleFilter !== 'all' ? 'No users match your filters.' : 'No users found.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 text-xs text-charcoal-muted bg-gray-50/50">
              Showing {filtered.length} of {users.length} users
            </div>
          )}
        </div>
      </div>
    </>
  );
}
