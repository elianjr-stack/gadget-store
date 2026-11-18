'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FolderTree } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('📱');

  const fetchCategories = () => {
    api
      .get('/categories')
      .then((res: any) => {
        if (res.data) setCategories(res.data);
      })
      .catch(() => {
        // Fallback demo categories
        setCategories([
          { id: '1', name: 'Smartphones', nameBn: 'স্মার্টফোন', slug: 'smartphones', icon: '📱', _count: { products: 15 } },
          { id: '2', name: 'Smart Watches', nameBn: 'স্মার্টওয়াচ', slug: 'smart-watches', icon: '⌚', _count: { products: 12 } },
          { id: '3', name: 'Earbuds & Headphones', nameBn: 'ইয়ারবাড ও হেডফোন', slug: 'earbuds-headphones', icon: '🎧', _count: { products: 18 } },
          { id: '4', name: 'Laptops', nameBn: 'ল্যাপটপ', slug: 'laptops', icon: '💻', _count: { products: 8 } },
          { id: '5', name: 'Tablets', nameBn: 'ট্যাবলেট', slug: 'tablets', icon: '📲', _count: { products: 6 } },
          { id: '6', name: 'Power Banks', nameBn: 'পাওয়ার ব্যাংক', slug: 'power-banks', icon: '🔋', _count: { products: 14 } },
          { id: '7', name: 'Chargers & Cables', nameBn: 'চার্জার ও ক্যাবল', slug: 'chargers-cables', icon: '🔌', _count: { products: 22 } },
          { id: '8', name: 'Accessories', nameBn: 'আনুষাঙ্গিক', slug: 'accessories', icon: '🎒', _count: { products: 30 } },
          { id: '9', name: 'Cameras', nameBn: 'ক্যামেরা', slug: 'cameras', icon: '📷', _count: { products: 4 } },
          { id: '10', name: 'Gaming', nameBn: 'গেমিং', slug: 'gaming', icon: '🎮', _count: { products: 9 } },
        ]);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const generatedSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
      const res: any = await api.post('/categories', {
        name,
        nameBn,
        slug: generatedSlug,
        icon,
      });

      setCategories([...categories, res.data || { id: String(Date.now()), name, nameBn, slug: generatedSlug, icon, _count: { products: 0 } }]);
      setIsAdding(false);
      setName('');
      setNameBn('');
      setSlug('');
      toast.success('Category created and live!');
    } catch {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('Category removed');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const columns = [
    {
      header: 'Category Name',
      cell: (row: any) => (
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{row.icon || '📦'}</span>
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            {row.nameBn && <p className="text-[11px] text-slate-400">{row.nameBn}</p>}
          </div>
        </div>
      ),
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
    },
    {
      header: 'Products Count',
      cell: (row: any) => (
        <span className="font-bold text-slate-800">
          {row._count?.products ?? 0} items
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
            Categories Management
          </h1>
          <p className="text-xs text-slate-500">
            Clicking a category on the storefront groups products from all brands together
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs animate-fade-in">
          <h3 className="font-bold text-sm text-slate-900">
            Create New Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              placeholder="Name (English)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="Name (বাংলা)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Icon Emoji (e.g. 📱)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Save Category
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
        data={categories}
        searchPlaceholder="Search categories..."
      />
    </div>
  );
}
