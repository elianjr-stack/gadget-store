'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const fetchBanners = () => {
    api
      .get('/banners/admin/all')
      .then((res: any) => {
        if (res.data) setBanners(res.data);
      })
      .catch(() => {
        // Fallback demo banners
        setBanners([
          { id: '1', title: 'iPhone 15 Pro Max', subtitle: 'Titanium. So strong. So light. So Pro.', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', link: '/products/iphone-15-pro-max', position: 'HERO', isActive: true },
          { id: '2', title: 'Samsung Galaxy S24 Ultra', subtitle: 'AI-powered Galaxy with built-in S-Pen', image: 'https://images.unsplash.com/photo-1707930524337-408abc9f8fd0?w=800', link: '/products/samsung-galaxy-s24-ultra', position: 'HERO', isActive: true },
          { id: '3', title: 'MacBook Air M3', subtitle: 'Supercharged by M3 chip', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', link: '/products/macbook-air-m3-13-inch', position: 'HERO', isActive: true },
        ]);
      });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) return;

    try {
      const res: any = await api.post('/banners', {
        title,
        subtitle,
        image,
        link: link || '/products',
        position: 'HERO',
        isActive: true,
      });

      setBanners([...banners, res.data || { id: String(Date.now()), title, subtitle, image, link, position: 'HERO', isActive: true }]);
      setIsAdding(false);
      setTitle('');
      setSubtitle('');
      setImage('');
      setLink('');
      toast.success('Banner added to homepage slider!');
    } catch {
      toast.error('Failed to create banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      setBanners(banners.filter((b) => b.id !== id));
      toast.success('Banner deleted');
    } catch {
      toast.error('Failed to delete banner');
    }
  };

  const columns = [
    {
      header: 'Preview',
      cell: (row: any) => (
        <div className="w-24 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
          <img src={row.image} alt={row.title} className="w-full h-full object-cover" />
        </div>
      ),
    },
    {
      header: 'Banner Headline',
      cell: (row: any) => (
        <div>
          <p className="font-bold text-slate-900">{row.title}</p>
          {row.subtitle && <p className="text-[11px] text-slate-400">{row.subtitle}</p>}
        </div>
      ),
    },
    {
      header: 'Target Link',
      cell: (row: any) => (
        <span className="font-mono text-slate-600 text-[11px]">{row.link || '—'}</span>
      ),
    },
    {
      header: 'Position',
      cell: (row: any) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
          {row.position}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hero Banners & CMS
          </h1>
          <p className="text-xs text-slate-500">
            Control the storefront homepage promotional sliders and marketing cards
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Banner</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs animate-fade-in">
          <h3 className="font-bold text-sm text-slate-900">
            Create Hero Banner Slide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Headline Title"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL (Cloudinary / Unsplash)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Target Link (e.g. /products/iphone-16)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Save Banner
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <DataTable
        columns={columns}
        data={banners}
        searchPlaceholder="Search banners..."
      />
    </div>
  );
}
