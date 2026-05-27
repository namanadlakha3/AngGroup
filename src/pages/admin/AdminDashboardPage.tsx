import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Building2, Users as UsersIcon, LayoutDashboard, Settings,
  TrendingUp, Eye, Clock, Star, ArrowUpRight, MessageSquare
} from 'lucide-react';
import clsx from 'clsx';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminPropertiesPage from './AdminPropertiesPage';
import AdminUsersPage from './AdminUsersPage';
import AdminLeadsPage from './AdminLeadsPage';
import { motion, AnimatePresence } from 'framer-motion';

interface Stats {
  properties: number;
  users: number;
  available: number;
  sold: number;
  newLeads: number;
}

interface RecentProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  status: string;
  image: string;
  created_at: string;
}

type Tab = 'overview' | 'properties' | 'users' | 'leads';

const tabs: { id: Tab; name: string; icon: React.ElementType }[] = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'properties', name: 'Properties', icon: Building2 },
  { id: 'users', name: 'Users', icon: UsersIcon },
  { id: 'leads', name: 'Leads', icon: MessageSquare },
];

function StatCard({
  label, value, icon: Icon, accent, delta
}: {
  label: string; value: number | string; icon: React.ElementType; accent: string; delta?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 flex items-start justify-between group hover:shadow-lg transition-shadow duration-300"
    >
      <div>
        <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-widest mb-3">{label}</div>
        <div className="text-4xl font-serif text-charcoal mb-1">{value}</div>
        {delta && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp size={11} /> {delta}
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon size={22} />
      </div>
    </motion.div>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    Available: 'bg-emerald-400',
    Sold: 'bg-red-400',
    Rented: 'bg-blue-400',
    'Under Offer': 'bg-amber-400',
    'Off Market': 'bg-gray-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] ?? 'bg-gray-400'} shrink-0`} />;
}

export default function AdminDashboardPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats>({ properties: 0, users: 0, available: 0, sold: 0, newLeads: 0 });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [
        { count: pCount },
        { count: uCount },
        { count: availCount },
        { count: soldCount },
        { count: newLeadsCount },
        { data: recent }
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'Available'),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'Sold'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('properties').select('id,title,location,price,status,image,created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({
        properties: pCount || 0,
        users: uCount || 0,
        available: availCount || 0,
        sold: soldCount || 0,
        newLeads: newLeadsCount || 0,
      });
      setRecentProperties(recent || []);
      setStatsLoading(false);
    }
    fetchData();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-charcoal-muted">Loading admin portal...</span>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-28 pb-20 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <div className="section-label mb-3">Admin Portal</div>
          <h1 className="text-4xl sm:text-5xl font-serif text-charcoal leading-tight">
            Dashboard
          </h1>
          <p className="text-charcoal-muted mt-2 text-sm">
            Welcome back, <span className="font-semibold text-charcoal">{profile?.email?.split('@')[0]}</span>.
            Manage your platform from here.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-2 text-sm text-amber-800 font-semibold shrink-0">
          <Star size={14} className="text-gold" />
          Administrator
        </div>
      </div>

      {/* Gold divider */}
      <div className="gold-divider mb-8" />

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex overflow-x-auto hide-scrollbar">
      {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge = tab.id === 'leads' && stats.newLeads > 0 ? stats.newLeads : null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                isActive
                  ? 'text-white shadow-md'
                  : 'text-gray-500 hover:text-charcoal hover:bg-gray-50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-tab-bg"
                  className="absolute inset-0 rounded-xl bg-charcoal"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={16} className={clsx('relative z-10', isActive ? 'text-gold' : 'text-gray-400')} />
              <span className="relative z-10">{tab.name}</span>
              {badge && (
                <span className="relative z-10 ml-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── OVERVIEW ─────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  label="Total Properties"
                  value={statsLoading ? '—' : stats.properties}
                  icon={Building2}
                  accent="bg-gold/10 text-gold"
                  delta="Platform inventory"
                />
                <StatCard
                  label="Registered Users"
                  value={statsLoading ? '—' : stats.users}
                  icon={UsersIcon}
                  accent="bg-blue-50 text-blue-600"
                  delta="All time signups"
                />
                <StatCard
                  label="Available"
                  value={statsLoading ? '—' : stats.available}
                  icon={Eye}
                  accent="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                  label="New Leads"
                  value={statsLoading ? '—' : stats.newLeads}
                  icon={MessageSquare}
                  accent="bg-red-50 text-red-500"
                  delta="Pending follow-up"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Properties */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-charcoal-muted" />
                      <h3 className="font-semibold text-charcoal text-sm">Recent Properties</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('properties')}
                      className="text-xs font-medium text-gold hover:text-gold-light transition-colors flex items-center gap-1"
                    >
                      View all <ArrowUpRight size={12} />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {statsLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="px-6 py-4 animate-pulse flex gap-3">
                          <div className="w-12 h-10 bg-gray-100 rounded-lg shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                          </div>
                        </div>
                      ))
                    ) : recentProperties.length === 0 ? (
                      <div className="py-10 text-center text-sm text-charcoal-muted">No properties yet.</div>
                    ) : (
                      recentProperties.map(prop => (
                        <div key={prop.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {prop.image && <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-charcoal truncate">{prop.title}</div>
                            <div className="text-xs text-charcoal-muted truncate">{prop.location}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-semibold text-charcoal">{prop.price}</div>
                            <div className="flex items-center gap-1 mt-0.5 justify-end">
                              <StatusDot status={prop.status} />
                              <span className="text-xs text-charcoal-muted">{prop.status}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <Settings size={16} className="text-charcoal-muted" />
                      <h3 className="font-semibold text-charcoal text-sm">Quick Actions</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <button
                      onClick={() => setActiveTab('properties')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gold/[0.03] transition-all text-left group"
                    >
                      <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Building2 size={16} className="text-gold" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-charcoal">Manage Properties</div>
                        <div className="text-xs text-charcoal-muted">Add, edit or remove listings</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
                    >
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <UsersIcon size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-charcoal">Manage Users</div>
                        <div className="text-xs text-charcoal-muted">Update roles & permissions</div>
                      </div>
                    </button>
                  </div>

                  {/* Property breakdown */}
                  <div className="px-6 pb-6">
                    <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">
                      Listing Breakdown
                    </div>
                    {statsLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {[
                          { label: 'Available', count: stats.available, color: 'bg-emerald-400', total: stats.properties },
                          { label: 'Sold', count: stats.sold, color: 'bg-red-400', total: stats.properties },
                          { label: 'Other', count: stats.properties - stats.available - stats.sold, color: 'bg-gray-300', total: stats.properties },
                        ].map(item => (
                          <div key={item.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-charcoal-muted">{item.label}</span>
                              <span className="font-medium text-charcoal">{item.count}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.color} transition-all duration-700`}
                                style={{ width: item.total > 0 ? `${(item.count / item.total) * 100}%` : '0%' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROPERTIES ───────────────────────────────── */}
          {activeTab === 'properties' && (
            <div className="mt-2">
              <div className="mb-6">
                <h2 className="text-2xl font-serif text-charcoal">Properties</h2>
                <p className="text-sm text-charcoal-muted mt-1">Add, edit, and manage all property listings.</p>
              </div>
              <AdminPropertiesPage />
            </div>
          )}

          {/* ── LEADS ───────────────────────────────────── */}
          {activeTab === 'leads' && (
            <div className="mt-2">
              <div className="mb-6">
                <h2 className="text-2xl font-serif text-charcoal">Leads</h2>
                <p className="text-sm text-charcoal-muted mt-1">Enquiries submitted via the property contact form.</p>
              </div>
              <AdminLeadsPage />
            </div>
          )}
          {/* ── USERS ────────────────────────────────────── */}
          {activeTab === 'users' && (
            <div className="mt-2">
              <div className="mb-6">
                <h2 className="text-2xl font-serif text-charcoal">Users</h2>
                <p className="text-sm text-charcoal-muted mt-1">Manage user accounts and admin privileges.</p>
              </div>
              <AdminUsersPage />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
