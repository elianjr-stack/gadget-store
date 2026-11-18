'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Upload, Trash2, Edit, ExternalLink, Barcode, TrendingUp, RefreshCw } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import StatusBadge from '../../../components/StatusBadge';
import { formatPrice } from '../../../lib/utils';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get('/products/admin/list?limit=100')
      .then((res: any) => {
        if (res.data) setProducts(res.data);
      })
      .catch(() => {
        // Fallback demo products with cost price & barcode
        setProducts([
          { id: '1', name: 'iPhone 15 Pro Max', sku: 'APL-IP15PM-256', barcode: '8801948291034', slug: 'iphone-15-pro-max', price: 185000, discountPrice: 178000, costPrice: 146000, stockQuantity: 25, stockStatus: 'IN_STOCK', brand: { name: 'Apple', brandColor: '#1D1D1F' }, category: { name: 'Smartphones' } },
          { id: '2', name: 'Samsung Galaxy S24 Ultra', sku: 'SAM-S24U-256', barcode: '8801948291035', slug: 'samsung-galaxy-s24-ultra', price: 165000, discountPrice: 158000, costPrice: 129500, stockQuantity: 30, stockStatus: 'IN_STOCK', brand: { name: 'Samsung', brandColor: '#1428A0' }, category: { name: 'Smartphones' } },
          { id: '3', name: 'Apple Watch Series 9', sku: 'APL-AWS9-45', barcode: '8801948291036', slug: 'apple-watch-series-9', price: 55000, discountPrice: 52000, costPrice: 42600, stockQuantity: 40, stockStatus: 'IN_STOCK', brand: { name: 'Apple', brandColor: '#1D1D1F' }, category: { name: 'Smart Watches' } },
          { id: '4', name: 'AirPods Pro 2', sku: 'APL-APP2-USB', barcode: '8801948291037', slug: 'airpods-pro-2nd-generation', price: 32000, discountPrice: 29500, costPrice: 24200, stockQuantity: 60, stockStatus: 'IN_STOCK', brand: { name: 'Apple', brandColor: '#1D1D1F' }, category: { name: 'Earbuds' } },
          { id: '5', name: 'Baseus 65W GaN Charger', sku: 'BAS-GAN65-3PORT', barcode: '8801948291038', slug: 'baseus-65w-gan-charger', price: 2800, discountPrice: 2500, costPrice: 1950, stockQuantity: 200, stockStatus: 'IN_STOCK', brand: { name: 'Baseus', brandColor: '#F5A623' }, category: { name: 'Chargers & Cables' } },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const columns = [
    {
      header: 'Product & Identifiers',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-1 flex-shrink-0">
            <img
              src={row.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'}
              alt={row.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate max-w-[200px]">{row.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-500 font-mono font-medium">SKU: {row.sku}</span>
              {row.barcode && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-mono font-bold">
                  <Barcode className="w-3 h-3" />
                  {row.barcode}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Brand & Category',
      cell: (row: any) => (
        <div>
          <span
            className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold text-white shadow-2xs"
            style={{ backgroundColor: row.brand?.brandColor || '#4F46E5' }}
          >
            {row.brand?.name || '—'}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">{row.category?.name || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Purchase Cost',
      cell: (row: any) => {
        const cost = row.costPrice ? Number(row.costPrice) : Math.round(Number(row.price) * 0.82);
        return (
          <span className="text-xs font-semibold text-slate-600">
            ৳{cost.toLocaleString('en-BD')}
          </span>
        );
      },
    },
    {
      header: 'Selling Price',
      cell: (row: any) => {
        const sell = Number(row.discountPrice || row.price);
        return (
          <div>
            <span className="font-bold text-slate-900 text-xs">
              ৳{sell.toLocaleString('en-BD')}
            </span>
            {row.discountPrice && (
              <span className="text-[10px] text-slate-400 line-through block">
                ৳{Number(row.price).toLocaleString('en-BD')}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Unit Profit & Margin',
      cell: (row: any) => {
        const sell = Number(row.discountPrice || row.price);
        const cost = row.costPrice ? Number(row.costPrice) : Math.round(Number(row.price) * 0.82);
        const profit = sell - cost;
        const margin = sell > 0 ? ((profit / sell) * 100).toFixed(1) : 0;
        return (
          <div>
            <span className="font-black text-emerald-600 text-xs block">
              +৳{profit.toLocaleString('en-BD')}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              {margin}% margin
            </span>
          </div>
        );
      },
    },
    {
      header: 'Stock',
      cell: (row: any) => (
        <div>
          <span className={`font-bold text-xs ${row.stockQuantity <= 5 ? 'text-rose-600' : 'text-slate-800'}`}>
            {row.stockQuantity} units
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row: any) => <StatusBadge status={row.stockStatus || 'IN_STOCK'} />,
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5">
          <Link
            href={`/products/${row.id}`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
            title="Edit Product, SKU, Barcode & Price"
          >
            <Edit className="w-4 h-4" />
          </Link>

          <a
            href={`http://localhost:3000/products/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition"
            title="View Live on Store"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Product & Inventory Catalog
            </h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Margin Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            SKU, barcode scanners, purchase costs, automated profit calculations, and stock levels across Bangladesh gadget lines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/products/import"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </Link>
          <Link
            href="/products/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Filter products by name, SKU, barcode, brand or category..."
      />
    </div>
  );
}
