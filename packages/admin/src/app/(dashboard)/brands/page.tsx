'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Tag, ExternalLink, Palette, Check, RefreshCw } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  { name: 'Apple Black', primary: '#1D1D1F', accent: '#424245', text: '#FFFFFF', badge: '#F5F5F7' },
  { name: 'Samsung Blue', primary: '#1428A0', accent: '#2C58F4', text: '#FFFFFF', badge: '#EBF0FF' },
  { name: 'Xiaomi Orange', primary: '#FF6900', accent: '#E05D00', text: '#FFFFFF', badge: '#FFF3EB' },
  { name: 'Redmi Flame', primary: '#FF4A00', accent: '#E63E00', text: '#FFFFFF', badge: '#FFF0EB' },
  { name: 'Realme Yellow', primary: '#FFC915', accent: '#DDAA00', text: '#1F2937', badge: '#FFFBEA' },
  { name: 'OnePlus Red', primary: '#EB0028', accent: '#C40021', text: '#FFFFFF', badge: '#FDE8EB' },
  { name: 'Google Blue', primary: '#4285F4', accent: '#3367D6', text: '#FFFFFF', badge: '#ECF3FE' },
  { name: 'Oraimo Green', primary: '#00B050', accent: '#008C40', text: '#FFFFFF', badge: '#E6F7EE' },
  { name: 'Anker Cyan', primary: '#00A0E9', accent: '#0085C4', text: '#FFFFFF', badge: '#E6F6FD' },
  { name: 'Baseus Gold', primary: '#F5A623', accent: '#D48812', text: '#1F2937', badge: '#FEF6E9' },
  { name: 'Huawei Crimson', primary: '#CF0A2C', accent: '#A80824', text: '#FFFFFF', badge: '#FAEBEE' },
  { name: 'Oppo Green', primary: '#046A38', accent: '#03542C', text: '#FFFFFF', badge: '#EBF5F0' },
  { name: 'Vivo Indigo', primary: '#415FFF', accent: '#2848F0', text: '#FFFFFF', badge: '#EEF1FF' },
  { name: 'Walton Navy', primary: '#004899', accent: '#003366', text: '#FFFFFF', badge: '#E6EDF5' },
  { name: 'Amazfit Pink', primary: '#FF4081', accent: '#E0356E', text: '#FFFFFF', badge: '#FEECEF' },
  { name: 'Asus Blue', primary: '#00539B', accent: '#003E75', text: '#FFFFFF', badge: '#E6EEF5' },
];

export default function BrandsAdminPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [brandColor, setBrandColor] = useState('#4F46E5');
  const [accentColor, setAccentColor] = useState('#06B6D4');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [badgeColor, setBadgeColor] = useState('#EEF2FF');

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/brands');
      if (res.data) setBrands(res.data);
    } catch {
      toast.error('Failed to load brands from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openEdit = (brand: any) => {
    setEditingBrand(brand);
    setName(brand.name);
    setWebsite(brand.website || '');
    setDescription(brand.description || '');
    setBrandColor(brand.brandColor || '#4F46E5');
    setAccentColor(brand.accentColor || '#06B6D4');
    setTextColor(brand.textColor || '#FFFFFF');
    setBadgeColor(brand.badgeColor || '#EEF2FF');
    setIsAdding(false);
  };

  const resetForm = () => {
    setName('');
    setWebsite('');
    setDescription('');
    setBrandColor('#4F46E5');
    setAccentColor('#06B6D4');
    setTextColor('#FFFFFF');
    setBadgeColor('#EEF2FF');
    setEditingBrand(null);
    setIsAdding(false);
  };

  const applyPreset = (preset: typeof PRESET_COLORS[0]) => {
    setBrandColor(preset.primary);
    setAccentColor(preset.accent);
    setTextColor(preset.text);
    setBadgeColor(preset.badge);
    toast.success(`Applied ${preset.name} palette`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const payload = {
        name,
        slug,
        website,
        description,
        brandColor,
        accentColor,
        textColor,
        badgeColor,
      };

      if (editingBrand) {
        await api.patch(`/brands/${editingBrand.id}`, payload);
        toast.success(`Updated ${name} brand identity & dynamic colors!`);
      } else {
        await api.post('/brands', payload);
        toast.success(`Brand ${name} created with custom color identity!`);
      }

      fetchBrands();
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save brand');
    }
  };

  const handleDelete = async (id: string, brandName: string) => {
    if (!confirm(`Are you sure you want to delete ${brandName}?`)) return;
    try {
      await api.delete(`/brands/${id}`);
      setBrands(brands.filter((b) => b.id !== id));
      toast.success('Brand deleted successfully');
    } catch {
      toast.error('Failed to delete brand');
    }
  };

  const columns = [
    {
      header: 'Brand & Color Identity',
      cell: (row: any) => {
        const bg = row.brandColor || '#4F46E5';
        const txt = row.textColor || '#FFFFFF';
        const bCol = row.badgeColor || '#EEF2FF';
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: bg, color: txt }}
            >
              {row.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{row.name}</span>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                  style={{ backgroundColor: bCol, color: bg }}
                >
                  {bg}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{row.description || 'No description'}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Color Palette Swatch',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-md shadow-xs border border-black/10"
            style={{ backgroundColor: row.brandColor || '#4F46E5' }}
            title={`Primary: ${row.brandColor || '#4F46E5'}`}
          />
          <div
            className="w-6 h-6 rounded-md shadow-xs border border-black/10"
            style={{ backgroundColor: row.accentColor || '#06B6D4' }}
            title={`Accent: ${row.accentColor || '#06B6D4'}`}
          />
          <div
            className="w-6 h-6 rounded-md shadow-xs border border-black/10"
            style={{ backgroundColor: row.badgeColor || '#EEF2FF' }}
            title={`Badge: ${row.badgeColor || '#EEF2FF'}`}
          />
        </div>
      ),
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
    },
    {
      header: 'Products',
      cell: (row: any) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
          {row._count?.products ?? 0} active
        </span>
      ),
    },
    {
      header: 'Website',
      cell: (row: any) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline flex items-center gap-1 text-xs font-semibold"
          >
            <span className="truncate max-w-[130px]">{row.website.replace('https://', '')}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
            title="Edit brand colors & info"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete brand"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Dynamic Brand Color & Catalog Management
            </h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Instant Live DB Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize official brand color identities (Apple, Samsung, Xiaomi, Realme, Oraimo, Anker, Baseus, etc.) without touching code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBrands}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh brands list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand with Custom Colors</span>
          </button>
        </div>
      </div>

      {/* Brand Create / Edit Form Drawer */}
      {(isAdding || editingBrand) && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-indigo-100 p-6 space-y-6 shadow-xl shadow-indigo-500/5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                {editingBrand ? `Customize Brand Colors: ${editingBrand.name}` : 'Register New Brand & Color System'}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              Close
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Fast Presets (Official Bangladesh Brand Standards)
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:border-indigo-400 transition"
                  style={{
                    backgroundColor: brandColor === p.primary ? p.badge : '#F8FAFC',
                    borderColor: brandColor === p.primary ? p.primary : '#E2E8F0',
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* General Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Realme or Oraimo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://brand.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Tagline / Bio</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Dare to Leap - smart devices"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dynamic Color Pickers & Live Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Dynamic Color Identity Controls
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Brand Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Accent Highlight</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Brand Pill Text</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Live Storefront Component Preview:
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs"
                  style={{ backgroundColor: badgeColor, color: brandColor }}
                >
                  {name || 'Brand Badge'}
                </span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition"
                  style={{ backgroundColor: brandColor, color: textColor }}
                >
                  View {name || 'Brand'} Products
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{editingBrand ? 'Save Brand Color Changes' : 'Create Brand'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Brands Table */}
      <DataTable
        columns={columns}
        data={brands}
        searchPlaceholder="Search brands by name or slug..."
      />
    </div>
  );
}
