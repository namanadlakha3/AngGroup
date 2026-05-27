import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MessageCircle, Clock, Search, X,
  Check, Trash2, Building2, ChevronDown, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  property_id: string | null;
  property_title: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';

const STATUS_CONFIG: Record<Lead['status'], { label: string; bg: string; text: string; dot: string }> = {
  new:       { label: 'New',       bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  contacted: { label: 'Contacted', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  closed:    { label: 'Closed',    bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────

interface Toast { id: number; message: string; type: 'success' | 'error' }

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium max-w-sm bg-white/95 backdrop-blur-md ${t.type === 'success' ? 'border-green-200 text-green-800' : 'border-red-200 text-red-800'}`}
          >
            {t.type === 'success' ? <Check size={16} className="text-green-600 shrink-0" /> : <AlertCircle size={16} className="text-red-500 shrink-0" />}
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} className="ml-auto opacity-50 hover:opacity-100"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAD CARD
// ─────────────────────────────────────────────────────────────────────────────

function LeadCard({ lead, onStatusChange, onDelete }: {
  lead: Lead;
  onStatusChange: (id: string, status: Lead['status']) => void;
  onDelete: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[lead.status];
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const formattedDate = new Date(lead.created_at).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-charcoal text-base">{lead.name}</h3>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} border-transparent`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          {lead.property_title && (
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
              <Building2 size={11} className="text-gold shrink-0" />
              <span className="truncate">{lead.property_title}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {/* Status dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(v => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-100 hover:border-gray-200 text-charcoal-muted hover:text-charcoal transition-colors"
            >
              Status <ChevronDown size={11} />
            </button>
            <AnimatePresence>
              {showStatusMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[130px]"
                >
                  {(Object.keys(STATUS_CONFIG) as Lead['status'][]).map(s => (
                    <button key={s}
                      onClick={() => { onStatusChange(lead.id, s); setShowStatusMenu(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-left hover:bg-gray-50 transition-colors ${lead.status === s ? 'text-gold' : 'text-charcoal'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                      {STATUS_CONFIG[s].label}
                      {lead.status === s && <Check size={10} className="ml-auto text-gold" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Delete */}
          <button
            onClick={() => onDelete(lead.id)}
            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <a href={`tel:${lead.phone}`}
          className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-gold transition-colors group"
        >
          <span className="w-7 h-7 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors shrink-0">
            <Phone size={13} className="text-gold" />
          </span>
          {lead.phone}
        </a>
        {lead.email && (
          <a href={`mailto:${lead.email}`}
            className="flex items-center gap-2 text-sm text-charcoal-muted hover:text-gold transition-colors group truncate"
          >
            <span className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gold/10 transition-colors shrink-0">
              <Mail size={13} className="text-charcoal-muted group-hover:text-gold transition-colors" />
            </span>
            <span className="truncate">{lead.email}</span>
          </a>
        )}
      </div>

      {/* Message */}
      {lead.message && (
        <div className="flex items-start gap-2 bg-gray-50/70 rounded-xl p-3 mb-3">
          <MessageCircle size={13} className="text-charcoal-muted shrink-0 mt-0.5" />
          <p className="text-xs text-charcoal-muted leading-relaxed">{lead.message}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 text-[10px] text-charcoal-muted">
        <Clock size={10} />
        {formattedDate}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = { current: 0 };

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = ++toastIdRef.current;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setIsLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleStatusChange = async (id: string, status: Lead['status']) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) { addToast('Failed to update status', 'error'); return; }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    addToast(`Marked as ${STATUS_CONFIG[status].label}`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) { addToast('Failed to delete lead', 'error'); return; }
    setLeads(prev => prev.filter(l => l.id !== id));
    addToast('Lead removed');
  };

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.property_title || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length,
  };

  return (
    <>
      <ToastContainer toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />

      <div className="space-y-5">
        {/* Stat pills */}
        <div className="flex flex-wrap gap-3">
          {(['all', 'new', 'contacted', 'closed'] as StatusFilter[]).map(s => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                statusFilter === s
                  ? 'bg-charcoal text-gold border-charcoal shadow-sm'
                  : 'bg-white text-charcoal-muted border-gray-100 hover:border-gray-200 hover:text-charcoal'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s as Lead['status']].label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-charcoal'}`}>
                {counts[s]}
              </span>
            </button>
          ))}
          <button
            onClick={fetchLeads}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-charcoal-muted border border-gray-100 hover:border-gray-200 hover:text-charcoal transition-all"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search by name, phone, email or property…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-9 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-charcoal-muted">
            <span className="font-semibold text-charcoal">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'lead' : 'leads'}
            {statusFilter !== 'all' && ` · filtered by ${STATUS_CONFIG[statusFilter as Lead['status']].label}`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-5 bg-gray-100 rounded-full w-16" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                  <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                </div>
                <div className="h-10 bg-gray-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 size={28} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-serif text-charcoal mb-2">No leads yet</h3>
            <p className="text-sm text-charcoal-muted">
              {search || statusFilter !== 'all'
                ? 'No leads match your current filters.'
                : 'Leads submitted via the property contact form will appear here.'}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
