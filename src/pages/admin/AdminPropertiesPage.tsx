import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { Property } from '../../types/property';
import {
  MapPin, Plus, Pencil, Trash2, X, Check, AlertCircle,
  Building2, Search, ChevronDown, Loader2, Star, Upload,
  Image as ImageIcon, ChevronRight, IndianRupee, Ruler,
  Home, Sparkles, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://twsmhjmnbzqhmqjpaxwt.supabase.co';
const BUCKET = 'property-images';
const MAX_IMAGES = 5;

const PROPERTY_TYPES = [
  { value: 'Apartment', emoji: '🏢' },
  { value: 'Villa', emoji: '🏠' },
  { value: 'Independent House', emoji: '🏡' },
  { value: 'Plot', emoji: '🏗️' },
  { value: 'Penthouse', emoji: '🏰' },
  { value: 'Studio', emoji: '🛋️' },
  { value: 'Duplex', emoji: '🏘️' },
  { value: 'Farmhouse', emoji: '🌾' },
  { value: 'Townhouse', emoji: '🏚️' },
  { value: 'Commercial', emoji: '🏬' },
  { value: 'Warehouse', emoji: '🏭' },
  { value: 'Office Space', emoji: '💼' },
  { value: 'Shop', emoji: '🏪' },
];

const PROPERTY_STATUSES = [
  { value: 'Available', emoji: '✅' },
  { value: 'Under Construction', emoji: '🔨' },
  { value: 'Ready to Move', emoji: '🎉' },
  { value: 'Under Offer', emoji: '✋' },
  { value: 'Rented', emoji: '🔑' },
  { value: 'Sold', emoji: '🏷️' },
  { value: 'Off Market', emoji: '🚫' },
];

const TRANSACTION_TYPES = [
  { value: 'New Property', emoji: '🆕' },
  { value: 'Resale', emoji: '🔄' },
];

const FACING_OPTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const FURNISHING_OPTIONS = [
  { value: 'Unfurnished', emoji: '🪑' },
  { value: 'Semi-Furnished', emoji: '🛋️' },
  { value: 'Fully Furnished', emoji: '✨' },
];
const PARKING_OPTIONS = [
  { value: 'None', emoji: '🚫' },
  { value: 'Open', emoji: '🅿️' },
  { value: 'Covered', emoji: '🏠' },
  { value: '2+ Covered', emoji: '🚗🚗' },
];
const POSSESSION_OPTIONS = [
  'Ready to Move', 'Within 6 Months', 'Within 1 Year', 'Within 2 Years', '2+ Years'
];
const WATER_SUPPLY_OPTIONS = ['Corporation', 'Borewell', 'Both', '24/7 Supply'];
const AGE_OPTIONS = [
  'New Construction', 'Less than 1 year', '1–3 years', '3–5 years', '5–10 years', 'More than 10 years'
];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const AMENITY_GROUPS: Record<string, { label: string; emoji: string }[]> = {
  'Lifestyle': [
    { label: 'Swimming Pool', emoji: '🏊' },
    { label: 'Gymnasium', emoji: '💪' },
    { label: 'Clubhouse', emoji: '🏛️' },
    { label: 'Spa & Sauna', emoji: '🧖' },
    { label: 'Yoga Deck', emoji: '🧘' },
    { label: 'Library', emoji: '📚' },
    { label: 'Cinema Room', emoji: '🎬' },
    { label: 'Rooftop Terrace', emoji: '🌇' },
  ],
  'Children': [
    { label: "Kids' Play Area", emoji: '🎠' },
    { label: "Kids' Pool", emoji: '🐬' },
    { label: 'Creche / Daycare', emoji: '🧒' },
    { label: 'Cycling Track', emoji: '🚴' },
  ],
  'Security': [
    { label: '24/7 Security', emoji: '🛡️' },
    { label: 'CCTV Surveillance', emoji: '📹' },
    { label: 'Intercom', emoji: '📞' },
    { label: 'Gated Entry', emoji: '🚧' },
    { label: 'Fire Safety', emoji: '🚒' },
  ],
  'Utilities': [
    { label: 'Power Backup', emoji: '⚡' },
    { label: 'Solar Power', emoji: '☀️' },
    { label: 'Rainwater Harvesting', emoji: '💧' },
    { label: 'Sewage Treatment', emoji: '🌱' },
    { label: 'Gas Pipeline', emoji: '🔥' },
    { label: 'EV Charging', emoji: '🔌' },
  ],
  'Convenience': [
    { label: 'Lift / Elevator', emoji: '🛗' },
    { label: 'Covered Parking', emoji: '🅿️' },
    { label: 'Visitor Parking', emoji: '🚗' },
    { label: 'Housekeeping', emoji: '🧹' },
    { label: 'Concierge', emoji: '🤵' },
    { label: 'Smart Home', emoji: '📱' },
    { label: 'Central AC', emoji: '❄️' },
    { label: 'Pet Friendly', emoji: '🐕' },
  ],
  'Outdoor': [
    { label: 'Garden / Park', emoji: '🌿' },
    { label: 'Jogging Track', emoji: '🏃' },
    { label: 'Badminton Court', emoji: '🏸' },
    { label: 'Tennis Court', emoji: '🎾' },
    { label: 'Squash Court', emoji: '🎯' },
    { label: 'Cricket Pitch', emoji: '🏏' },
    { label: 'Basketball Court', emoji: '🏀' },
  ],
  'Views': [
    { label: 'Sea View', emoji: '🌊' },
    { label: 'Mountain View', emoji: '⛰️' },
    { label: 'City View', emoji: '🌃' },
    { label: 'Garden View', emoji: '🌺' },
    { label: 'Pool View', emoji: '💦' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }

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
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium max-w-sm ${
              t.type === 'success' ? 'bg-white/95 border-green-200 text-green-800'
              : t.type === 'error' ? 'bg-white/95 border-red-200 text-red-800'
              : 'bg-white/95 border-gold/30 text-charcoal'
            }`}
          >
            {t.type === 'success' && <Check size={16} className="text-green-600 shrink-0" />}
            {t.type === 'error' && <AlertCircle size={16} className="text-red-500 shrink-0" />}
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} className="ml-auto opacity-50 hover:opacity-100"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM DIALOG
// ─────────────────────────────────────────────────────────────────────────────

function ConfirmDialog({ title, message, onConfirm, onCancel, loading }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full z-10 border border-red-100"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
        </div>
        <p className="text-sm text-charcoal-muted mb-6 pl-13">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={loading}
            className="px-4 py-2 text-sm font-medium text-charcoal bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UPLOADER
// ─────────────────────────────────────────────────────────────────────────────

interface UploadedImage {
  id: string;           // local id
  url: string;          // final public URL
  uploading?: boolean;
  error?: string;
  file?: File;
  preview?: string;     // local blob URL for instant preview
}

function ImageUploader({
  images, onChange, primaryIndex, onSetPrimary
}: {
  images: UploadedImage[];
  onChange: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  primaryIndex: number;
  onSetPrimary: (idx: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
    if (error) throw error;
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const toAdd = Array.from(files).slice(0, MAX_IMAGES - images.length);
    if (toAdd.length === 0) return;

    const placeholders: UploadedImage[] = toAdd.map(f => ({
      id: Math.random().toString(36).slice(2),
      url: '',
      uploading: true,
      file: f,
      preview: URL.createObjectURL(f),
    }));
    onChange([...images, ...placeholders]);

    for (let i = 0; i < placeholders.length; i++) {
      const ph = placeholders[i];
      try {
        const url = await uploadFile(toAdd[i]);
        onChange(prev => prev.map(img => img.id === ph.id ? { ...img, url, uploading: false } : img));
      } catch {
        onChange(prev => prev.map(img => img.id === ph.id ? { ...img, uploading: false, error: 'Upload failed' } : img));
      }
    }
  }, [images, onChange]);

  const removeImage = (id: string, idx: number) => {
    const newImgs = images.filter(img => img.id !== id);
    onChange(newImgs);
    if (primaryIndex === idx && newImgs.length > 0) onSetPrimary(0);
    else if (primaryIndex > idx) onSetPrimary(primaryIndex - 1);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const canAdd = images.length < MAX_IMAGES;

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      {canAdd && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-gold bg-gold/5 scale-[1.01]'
              : 'border-gray-200 hover:border-gold/50 hover:bg-gray-50/60'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              dragging ? 'bg-gold/20' : 'bg-gray-100'
            }`}>
              <Upload size={22} className={dragging ? 'text-gold' : 'text-gray-400'} />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">
                {dragging ? 'Drop images here' : 'Upload property photos'}
              </p>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Drag & drop or click · JPEG, PNG, WebP · Max 10 MB each · {images.length}/{MAX_IMAGES} uploaded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnail Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2.5">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 transition-all duration-200"
              style={{ borderColor: idx === primaryIndex ? '#B8860B' : 'transparent' }}>

              {/* Preview */}
              {(img.preview || img.url) && (
                <img
                  src={img.preview || img.url}
                  alt={`Photo ${idx + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${img.uploading ? 'opacity-50' : 'opacity-100'}`}
                />
              )}

              {/* Upload spinner */}
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 size={18} className="text-white animate-spin" />
                </div>
              )}

              {/* Error */}
              {img.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
                  <AlertCircle size={18} className="text-white" />
                </div>
              )}

              {/* Primary badge */}
              {idx === primaryIndex && !img.uploading && (
                <div className="absolute top-1 left-1 bg-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Star size={8} fill="white" /> Primary
                </div>
              )}

              {/* Hover Actions */}
              {!img.uploading && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {idx !== primaryIndex && (
                    <button
                      type="button"
                      onClick={() => onSetPrimary(idx)}
                      className="w-7 h-7 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-colors"
                      title="Set as primary"
                    >
                      <Star size={12} className="text-white" fill="white" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id, idx)}
                    className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add more slot */}
          {canAdd && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-gold/40 hover:bg-gold/5 flex flex-col items-center justify-center gap-1 transition-all group"
            >
              <Plus size={18} className="text-gray-300 group-hover:text-gold transition-colors" />
              <span className="text-[10px] text-gray-400 group-hover:text-gold transition-colors font-medium">Add</span>
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-charcoal-muted">
        ⭐ Click the star icon on any photo to set it as the primary listing image. First uploaded photo is primary by default.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface FormData {
  title: string;
  description: string;
  type: string;
  status: string;
  transaction_type: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  price: string;
  price_numeric: string;
  price_per_sqft: string;
  maintenance: string;
  is_negotiable: boolean;
  super_built_up_area: string;
  built_up_area: string;
  carpet_area: string;
  plot_area: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  floor_number: string;
  total_floors: string;
  facing: string;
  furnishing: string;
  parking: string;
  age_of_property: string;
  possession_status: string;
  water_supply: string;
  power_backup: boolean;
  gated_community: boolean;
  amenities: string[];
  highlighted_features: string;
}

const EMPTY_FORM: FormData = {
  title: '', description: '', type: 'Apartment', status: 'Available', transaction_type: 'New Property',
  locality: '', city: 'Mumbai', state: 'Maharashtra', pincode: '',
  price: '', price_numeric: '', price_per_sqft: '', maintenance: '', is_negotiable: false,
  super_built_up_area: '', built_up_area: '', carpet_area: '', plot_area: '',
  bedrooms: 2, bathrooms: 2, balconies: 1, floor_number: '', total_floors: '',
  facing: '', furnishing: 'Unfurnished', parking: 'Covered',
  age_of_property: '', possession_status: 'Ready to Move',
  water_supply: 'Corporation', power_backup: false, gated_community: false,
  amenities: [], highlighted_features: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <span className="text-gold">{icon}</span>
        <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-1.5">{children}</label>;
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; emoji?: string }[];
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className="form-input appearance-none pr-8">
          {options.map(o => <option key={o.value} value={o.value}>{o.emoji ? `${o.emoji} ${o.value}` : o.value}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY MODAL
// ─────────────────────────────────────────────────────────────────────────────

function PropertyModal({ property, onClose, onSave }: {
  property: Property | null;
  onClose: () => void;
  onSave: (data: FormData, images: UploadedImage[], primaryIdx: number) => Promise<void>;
}) {
  const isEdit = !!property;

  const [form, setForm] = useState<FormData>(() => {
    if (!property) return EMPTY_FORM;
    return {
      title: property.title || '',
      description: property.description || '',
      type: property.type || 'Apartment',
      status: property.status || 'Available',
      transaction_type: property.transaction_type || 'New Property',
      locality: property.locality || '',
      city: property.city || '',
      state: property.state || '',
      pincode: property.pincode || '',
      price: property.price || '',
      price_numeric: property.price_numeric?.toString() || '',
      price_per_sqft: property.price_per_sqft || '',
      maintenance: property.maintenance || '',
      is_negotiable: property.is_negotiable || false,
      super_built_up_area: property.super_built_up_area || '',
      built_up_area: property.built_up_area || '',
      carpet_area: property.carpet_area || '',
      plot_area: property.plot_area || '',
      bedrooms: property.bedrooms ?? 2,
      bathrooms: property.bathrooms ?? 2,
      balconies: property.balconies ?? 1,
      floor_number: property.floor_number?.toString() || '',
      total_floors: property.total_floors?.toString() || '',
      facing: property.facing || '',
      furnishing: property.furnishing || 'Unfurnished',
      parking: property.parking || 'Covered',
      age_of_property: property.age_of_property || '',
      possession_status: property.possession_status || 'Ready to Move',
      water_supply: property.water_supply || 'Corporation',
      power_backup: property.power_backup || false,
      gated_community: property.gated_community || false,
      amenities: property.amenities || [],
      highlighted_features: (property.highlighted_features || []).join('\n'),
    };
  });

  // Build initial images from gallery
  const [images, setImages] = useState<UploadedImage[]>(() => {
    const gallery = property?.gallery || [];
    if (gallery.length > 0) {
      return gallery.map((url, i) => ({ id: `existing_${i}`, url }));
    }
    if (property?.image) {
      return [{ id: 'existing_0', url: property.image }];
    }
    return [];
  });
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [activeSection, setActiveSection] = useState(0);

  const isPlotType = form.type === 'Plot';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof FormData) => (val: string | number | boolean | string[]) =>
    setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.price.trim()) errs.price = 'Required';
    if (!form.description.trim()) errs.description = 'Required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await onSave(form, images, primaryIdx);
    setSaving(false);
  };

  const toggleAmenity = (a: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
    }));
  };

  const SECTIONS = [
    { id: 'photos', label: 'Photos', icon: '📸' },
    { id: 'basic', label: 'Basic Info', icon: '🏷️' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'pricing', label: 'Pricing', icon: '₹' },
    { id: 'area', label: 'Area & Details', icon: '📐' },
    { id: 'amenities', label: 'Amenities', icon: '✨' },
    { id: 'extras', label: 'Extras', icon: '📋' },
  ];

  const uploadingCount = images.filter(i => i.uploading).length;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative ml-auto w-full max-w-3xl bg-white shadow-2xl flex flex-col overflow-hidden z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-charcoal to-charcoal-light shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
              <Building2 size={15} className="text-gold" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{isEdit ? 'Edit Property' : 'New Property Listing'}</h2>
              <p className="text-xs text-white/50">Fill in details across all sections</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 bg-gray-50/50 shrink-0">
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(i)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeSection === i
                  ? 'border-gold text-gold bg-white'
                  : 'border-transparent text-charcoal-muted hover:text-charcoal hover:bg-white/60'
              }`}
            >
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">

            {/* ── PHOTOS ─────────────────────────────────────────── */}
            {activeSection === 0 && (
              <Section icon={<ImageIcon size={16} />} title="Property Photos">
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  primaryIndex={primaryIdx}
                  onSetPrimary={setPrimaryIdx}
                />
              </Section>
            )}

            {/* ── BASIC INFO ─────────────────────────────────────── */}
            {activeSection === 1 && (
              <Section icon={<Home size={16} />} title="Basic Information">
                <div>
                  <Label>Property Title *</Label>
                  <input value={form.title} onChange={e => { set('title')(e.target.value); setErrors(er => ({...er, title: undefined})); }}
                    placeholder="e.g. Luxurious 3BHK in Bandra West" className={`form-input ${errors.title ? 'border-red-400' : ''}`} />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField label="Property Type" value={form.type} onChange={set('type')} options={PROPERTY_TYPES} />
                  <SelectField label="Listing Status" value={form.status} onChange={set('status')} options={PROPERTY_STATUSES} />
                  <SelectField label="Transaction Type" value={form.transaction_type} onChange={set('transaction_type')} options={TRANSACTION_TYPES} />
                </div>

                {!isPlotType && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { key: 'bedrooms', label: '🛏️ Bedrooms', min: 0, max: 20 },
                      { key: 'bathrooms', label: '🚿 Bathrooms', min: 0, max: 20 },
                      { key: 'balconies', label: '🌅 Balconies', min: 0, max: 10 },
                    ].map(({ key, label, min, max }) => (
                      <div key={key}>
                        <Label>{label}</Label>
                        <input type="number" min={min} max={max}
                          value={form[key as keyof FormData] as number}
                          onChange={e => set(key as keyof FormData)(parseInt(e.target.value) || 0)}
                          className="form-input" />
                      </div>
                    ))}
                    <div>
                      <Label>🪟 Floor No.</Label>
                      <input type="number" value={form.floor_number}
                        onChange={e => set('floor_number')(e.target.value)}
                        placeholder="e.g. 8" className="form-input" />
                    </div>
                  </div>
                )}

                {!isPlotType && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <Label>🏢 Total Floors</Label>
                      <input type="number" value={form.total_floors}
                        onChange={e => set('total_floors')(e.target.value)}
                        placeholder="e.g. 20" className="form-input" />
                    </div>
                    <SelectField label="🧭 Facing" value={form.facing} onChange={set('facing')}
                      options={[{ value: '' }, ...FACING_OPTIONS.map(f => ({ value: f }))]} />
                    <SelectField label="🛋️ Furnishing" value={form.furnishing} onChange={set('furnishing')} options={FURNISHING_OPTIONS} />
                    <SelectField label="🅿️ Parking" value={form.parking} onChange={set('parking')} options={PARKING_OPTIONS} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="🕐 Age of Property" value={form.age_of_property} onChange={set('age_of_property')}
                    options={[{ value: '' }, ...AGE_OPTIONS.map(v => ({ value: v }))]} />
                  <SelectField label="🎉 Possession Status" value={form.possession_status} onChange={set('possession_status')}
                    options={POSSESSION_OPTIONS.map(v => ({ value: v }))} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField label="💧 Water Supply" value={form.water_supply} onChange={set('water_supply')}
                    options={WATER_SUPPLY_OPTIONS.map(v => ({ value: v }))} />
                  <div>
                    <Label>⚡ Power Backup</Label>
                    <div className="flex gap-2 mt-1">
                      {[true, false].map(v => (
                        <button key={String(v)} type="button" onClick={() => set('power_backup')(v)}
                          className={`flex-1 py-2.5 text-sm rounded-lg border font-medium transition-all ${
                            form.power_backup === v ? 'bg-charcoal text-gold border-charcoal' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}>
                          {v ? '✅ Yes' : '❌ No'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>🔒 Gated Community</Label>
                    <div className="flex gap-2 mt-1">
                      {[true, false].map(v => (
                        <button key={String(v)} type="button" onClick={() => set('gated_community')(v)}
                          className={`flex-1 py-2.5 text-sm rounded-lg border font-medium transition-all ${
                            form.gated_community === v ? 'bg-charcoal text-gold border-charcoal' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}>
                          {v ? '✅ Yes' : '❌ No'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Property Description *</Label>
                  <textarea value={form.description}
                    onChange={e => { set('description')(e.target.value); setErrors(er => ({...er, description: undefined})); }}
                    rows={4} placeholder="Describe the property, its highlights, neighbourhood, nearby landmarks..."
                    className={`form-input resize-none ${errors.description ? 'border-red-400' : ''}`} />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>
              </Section>
            )}

            {/* ── LOCATION ────────────────────────────────────────── */}
            {activeSection === 2 && (
              <Section icon={<MapPin size={16} />} title="Location Details">
                <div>
                  <Label>Locality / Area / Street</Label>
                  <input value={form.locality} onChange={e => set('locality')(e.target.value)}
                    placeholder="e.g. Bandra West, Near Linking Road" className="form-input" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <input value={form.city} onChange={e => set('city')(e.target.value)}
                      placeholder="e.g. Mumbai" className="form-input" />
                  </div>
                  <div>
                    <Label>State</Label>
                    <div className="relative">
                      <select value={form.state} onChange={e => set('state')(e.target.value)} className="form-input appearance-none pr-8">
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <Label>PIN Code</Label>
                    <input value={form.pincode} onChange={e => set('pincode')(e.target.value)}
                      placeholder="400050" maxLength={6} className="form-input" />
                  </div>
                </div>
                {/* Full display address preview */}
                {(form.locality || form.city) && (
                  <div className="bg-gold/5 border border-gold/20 rounded-xl px-4 py-3">
                    <p className="text-xs text-charcoal-muted font-semibold uppercase tracking-wider mb-1">Preview Address</p>
                    <p className="text-sm text-charcoal font-medium flex items-center gap-2">
                      <MapPin size={14} className="text-gold shrink-0" />
                      {[form.locality, form.city, form.state, form.pincode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </Section>
            )}

            {/* ── PRICING ─────────────────────────────────────────── */}
            {activeSection === 3 && (
              <Section icon={<IndianRupee size={16} />} title="Pricing (INR)">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Asking Price * (₹)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">₹</span>
                      <input value={form.price} onChange={e => { set('price')(e.target.value); setErrors(er => ({...er, price: undefined})); }}
                        placeholder="e.g. 1.5 Cr or 45,00,000" className={`form-input pl-7 ${errors.price ? 'border-red-400' : ''}`} />
                    </div>
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <Label>Price (Numeric for sorting)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">₹</span>
                      <input type="number" value={form.price_numeric} onChange={e => set('price_numeric')(e.target.value)}
                        placeholder="e.g. 15000000" className="form-input pl-7" />
                    </div>
                    <p className="text-xs text-charcoal-muted mt-1">Enter raw number (no commas) for filtering</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Price per Sq Ft (₹)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">₹</span>
                      <input value={form.price_per_sqft} onChange={e => set('price_per_sqft')(e.target.value)}
                        placeholder="e.g. ₹ 18,500/sq ft" className="form-input pl-7" />
                    </div>
                  </div>
                  <div>
                    <Label>Monthly Maintenance (₹)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">₹</span>
                      <input value={form.maintenance} onChange={e => set('maintenance')(e.target.value)}
                        placeholder="e.g. ₹ 5,000/month" className="form-input pl-7" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Price Negotiable?</Label>
                  <div className="flex gap-3">
                    {[true, false].map(v => (
                      <button key={String(v)} type="button" onClick={() => set('is_negotiable')(v)}
                        className={`px-5 py-2.5 text-sm rounded-xl border font-medium transition-all ${
                          form.is_negotiable === v ? 'bg-charcoal text-gold border-charcoal' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}>
                        {v ? '✅ Yes, Negotiable' : '🔒 Fixed Price'}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* ── AREA & DETAILS ──────────────────────────────────── */}
            {activeSection === 4 && (
              <Section icon={<Ruler size={16} />} title="Area & Dimensions">
                {isPlotType ? (
                  <div>
                    <Label>Plot Area</Label>
                    <input value={form.plot_area} onChange={e => set('plot_area')(e.target.value)}
                      placeholder="e.g. 2400 sq ft or 60×40 ft" className="form-input" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Super Built-up Area</Label>
                      <input value={form.super_built_up_area} onChange={e => set('super_built_up_area')(e.target.value)}
                        placeholder="e.g. 1,850 sq ft" className="form-input" />
                      <p className="text-xs text-charcoal-muted mt-1">Includes common areas</p>
                    </div>
                    <div>
                      <Label>Built-up Area</Label>
                      <input value={form.built_up_area} onChange={e => set('built_up_area')(e.target.value)}
                        placeholder="e.g. 1,600 sq ft" className="form-input" />
                      <p className="text-xs text-charcoal-muted mt-1">Walls + carpet area</p>
                    </div>
                    <div>
                      <Label>Carpet Area</Label>
                      <input value={form.carpet_area} onChange={e => set('carpet_area')(e.target.value)}
                        placeholder="e.g. 1,350 sq ft" className="form-input" />
                      <p className="text-xs text-charcoal-muted mt-1">Actual usable area</p>
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* ── AMENITIES ───────────────────────────────────────── */}
            {activeSection === 5 && (
              <Section icon={<Sparkles size={16} />} title="Amenities & Features">
                <p className="text-xs text-charcoal-muted -mt-2">
                  {form.amenities.length} amenities selected
                </p>
                {Object.entries(AMENITY_GROUPS).map(([group, items]) => (
                  <div key={group}>
                    <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">{group}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {items.map(({ label, emoji }) => (
                        <button key={label} type="button" onClick={() => toggleAmenity(label)}
                          className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all flex items-center gap-1.5 ${
                            form.amenities.includes(label)
                              ? 'bg-charcoal text-gold border-charcoal shadow-sm'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gold/40 hover:text-charcoal'
                          }`}>
                          <span>{emoji}</span>{label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* ── EXTRAS ──────────────────────────────────────────── */}
            {activeSection === 6 && (
              <Section icon={<FileText size={16} />} title="Additional Details">
                <div>
                  <Label>🌟 Key Highlights (one per line)</Label>
                  <textarea value={form.highlighted_features} onChange={e => set('highlighted_features')(e.target.value)}
                    rows={5} placeholder={`e.g.\nSeahorse Views from Living Room\n2 min walk to Metro Station\nPrime school zone\nNo GST applicable`}
                    className="form-input resize-none" />
                  <p className="text-xs text-charcoal-muted mt-1">These show as bullet points on the listing page</p>
                </div>
              </Section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between shrink-0 gap-3">
          <div className="flex gap-2">
            {activeSection > 0 && (
              <button type="button" onClick={() => setActiveSection(s => s - 1)}
                className="px-4 py-2 text-sm font-medium text-charcoal bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                ← Previous
              </button>
            )}
            {activeSection < SECTIONS.length - 1 && (
              <button type="button" onClick={() => setActiveSection(s => s + 1)}
                className="px-4 py-2 text-sm font-medium text-charcoal bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                Next <ChevronRight size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {uploadingCount > 0 && (
              <span className="text-xs text-charcoal-muted flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin text-gold" />
                Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...
              </span>
            )}
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-charcoal bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || uploadingCount > 0}
              className="btn-gold px-5 py-2 text-sm flex items-center gap-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> {isEdit ? 'Save Changes' : 'Publish Listing'}</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Available':          'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Ready to Move':      'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Under Construction': 'bg-orange-50 text-orange-700 border-orange-200',
    'Sold':               'bg-red-50 text-red-700 border-red-200',
    'Rented':             'bg-blue-50 text-blue-700 border-blue-200',
    'Under Offer':        'bg-amber-50 text-amber-700 border-amber-200',
    'Off Market':         'bg-gray-100 text-gray-600 border-gray-200',
  };
  const emoji = PROPERTY_STATUSES.find(s => s.value === status)?.emoji || '';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {emoji} {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [modalProperty, setModalProperty] = useState<Property | null | 'new'>(null);
  const [confirmDelete, setConfirmDelete] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const fetchProperties = async () => {
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (!error && data) setProperties(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleSave = async (form: FormData, images: UploadedImage[], primaryIdx: number) => {
    // Build gallery array: primary image first
    const galleryUrls = images.filter(i => i.url && !i.error).map(i => i.url);
    const reordered = primaryIdx > 0
      ? [galleryUrls[primaryIdx], ...galleryUrls.filter((_, i) => i !== primaryIdx)]
      : galleryUrls;

    const primaryUrl = reordered[0] || '';

    // Build the full location string
    const locationStr = [form.locality, form.city, form.state].filter(Boolean).join(', ');

    const isPlot = form.type === 'Plot';

    const payload: Partial<Property> = {
      title: form.title,
      description: form.description,
      type: form.type,
      status: form.status,
      transaction_type: form.transaction_type,
      location: locationStr || 'India',
      locality: form.locality || undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      pincode: form.pincode || undefined,
      price: form.price,
      price_numeric: form.price_numeric ? parseInt(form.price_numeric) : undefined,
      price_per_sqft: form.price_per_sqft || undefined,
      maintenance: form.maintenance || undefined,
      is_negotiable: form.is_negotiable,
      area: form.super_built_up_area || form.carpet_area || form.plot_area || form.built_up_area || '',
      super_built_up_area: isPlot ? undefined : (form.super_built_up_area || undefined),
      built_up_area: isPlot ? undefined : (form.built_up_area || undefined),
      carpet_area: isPlot ? undefined : (form.carpet_area || undefined),
      plot_area: isPlot ? (form.plot_area || undefined) : undefined,
      bedrooms: isPlot ? undefined : form.bedrooms,
      bathrooms: isPlot ? undefined : form.bathrooms,
      balconies: isPlot ? undefined : form.balconies,
      floor_number: isPlot ? undefined : (form.floor_number ? parseInt(form.floor_number) : undefined),
      total_floors: isPlot ? undefined : (form.total_floors ? parseInt(form.total_floors) : undefined),
      facing: isPlot ? undefined : (form.facing || undefined),
      furnishing: isPlot ? undefined : form.furnishing,
      parking: isPlot ? undefined : form.parking,
      age_of_property: form.age_of_property || undefined,
      possession_status: form.possession_status,
      water_supply: form.water_supply || undefined,
      power_backup: form.power_backup,
      gated_community: form.gated_community,
      amenities: form.amenities,
      highlighted_features: form.highlighted_features
        ? form.highlighted_features.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      image: primaryUrl,
      gallery: reordered,
    };

    if (modalProperty === 'new') {
      const { error } = await supabase.from('properties').insert([payload]);
      if (error) { addToast('Failed to add listing: ' + error.message, 'error'); return; }
      addToast('✅ Property listing published!');
    } else if (modalProperty) {
      const { error } = await supabase.from('properties').update(payload).eq('id', (modalProperty as Property).id);
      if (error) { addToast('Failed to update listing: ' + error.message, 'error'); return; }
      addToast('✅ Listing updated successfully!');
    }

    setModalProperty(null);
    fetchProperties();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    const { error } = await supabase.from('properties').delete().eq('id', confirmDelete.id);
    setDeleting(false);
    if (error) {
      addToast('Failed to delete: ' + error.message, 'error');
    } else {
      addToast('Property removed.');
      setProperties(p => p.filter(x => x.id !== confirmDelete.id));
    }
    setConfirmDelete(null);
  };

  const uniqueTypes = ['All', ...Array.from(new Set(properties.map(p => p.type)))];
  const filtered = properties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
      || p.location.toLowerCase().includes(search.toLowerCase())
      || (p.city || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || p.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <>
      <ToastContainer toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />

      <AnimatePresence>
        {(modalProperty !== null) && (
          <PropertyModal
            property={modalProperty === 'new' ? null : modalProperty as Property}
            onClose={() => setModalProperty(null)}
            onSave={handleSave}
          />
        )}
        {confirmDelete && (
          <ConfirmDialog
            title="Delete Listing"
            message={`Permanently delete "${confirmDelete.title}"? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="search-wrap flex-1 min-w-48 max-w-xs">
              <Search size={15} className="search-icon" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search listings..."
                className="form-input text-sm"
                style={{ paddingTop: '10px', paddingBottom: '10px' }}
              />
            </div>
            <div className="relative shrink-0">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="form-input appearance-none text-sm"
                style={{ paddingTop: '10px', paddingBottom: '10px', paddingRight: '32px' }}
              >
                {uniqueTypes.map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
            </div>
          </div>
          <button onClick={() => setModalProperty('new')}
            className="btn-gold px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl shrink-0">
            <Plus size={16} /> Add Listing
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 size={20} className="animate-spin text-gold" />
              <span className="text-sm text-charcoal-muted">Loading listings...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                    <th className="px-5 py-3.5">Property</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5 hidden md:table-cell">Type</th>
                    <th className="px-5 py-3.5 hidden sm:table-cell">Status</th>
                    <th className="px-5 py-3.5 hidden lg:table-cell">Area</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence>
                    {filtered.map((property, i) => {
                      const typeInfo = PROPERTY_TYPES.find(t => t.value === property.type);
                      return (
                        <motion.tr key={property.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03 }} className="hover:bg-gold/[0.02] transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                                {property.image
                                  ? <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-xl">{typeInfo?.emoji || '🏠'}</div>
                                }
                              </div>
                              <div>
                                <div className="font-semibold text-charcoal text-sm leading-tight max-w-[200px] truncate">{property.title}</div>
                                <div className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} />
                                  <span className="max-w-[180px] truncate">
                                    {property.locality ? `${property.locality}, ` : ''}{property.city || property.location}
                                  </span>
                                </div>
                                {property.type !== 'Plot' && property.bedrooms !== undefined && property.bedrooms > 0 && (
                                  <div className="text-xs text-charcoal-muted mt-0.5">
                                    🛏️ {property.bedrooms} · 🚿 {property.bathrooms}
                                    {property.carpet_area && ` · ${property.carpet_area}`}
                                  </div>
                                )}
                                {property.type === 'Plot' && property.plot_area && (
                                  <div className="text-xs text-charcoal-muted mt-0.5">
                                    📐 {property.plot_area}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-charcoal text-sm">₹ {property.price}</div>
                            {property.price_per_sqft && <div className="text-xs text-charcoal-muted">{property.price_per_sqft}/sq ft</div>}
                            {property.is_negotiable && <div className="text-xs text-emerald-600 font-medium">Negotiable</div>}
                          </td>
                          <td className="px-5 py-4 text-sm text-charcoal-muted hidden md:table-cell">
                            {typeInfo?.emoji || ''} {property.type}
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell"><StatusBadge status={property.status} /></td>
                          <td className="px-5 py-4 text-sm text-charcoal-muted hidden lg:table-cell">
                            {property.super_built_up_area || property.carpet_area || property.plot_area || property.area}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setModalProperty(property)}
                                className="p-2 rounded-lg text-charcoal hover:bg-gold/10 hover:text-gold transition-all" title="Edit">
                                <Pencil size={15} />
                              </button>
                              <button onClick={() => setConfirmDelete(property)}
                                className="p-2 rounded-lg text-charcoal hover:bg-red-50 hover:text-red-500 transition-all" title="Delete">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="text-4xl mb-3">🏗️</div>
                        <p className="text-sm text-charcoal-muted font-medium">
                          {search || typeFilter !== 'All' ? 'No listings match your filters.' : 'No listings yet. Add your first property!'}
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
              {filtered.length} of {properties.length} listings
            </div>
          )}
        </div>
      </div>
    </>
  );
}
