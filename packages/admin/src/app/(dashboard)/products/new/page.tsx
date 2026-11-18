'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function CreateProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('12');
  const [emiAvailable, setEmiAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  // Specs & Variants
  const [specs, setSpecs] = useState<{ group: string; name: string; value: string }[]>([
    { group: 'Display', name: 'Screen Size', value: '6.7 inches' },
    { group: 'Processor', name: 'Chipset', value: 'A17 Pro / Snapdragon 8 Gen 3' },
  ]);

  const [variants, setVariants] = useState<{ type: string; name: string; value: string; price: string }[]>([
    { type: 'storage', name: '256GB - Official BD', value: '256gb', price: '' },
  ]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
    );
  };

  const addSpec = () => {
    setSpecs([...specs, { group: 'General', name: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { type: 'storage', name: '', value: '', price: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price) {
      toast.error('Please fill required fields (Name, SKU, Price)');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        nameBn: nameBn || undefined,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        sku,
        brandId: brandId || 'apple',
        categoryId: categoryId || 'smartphones',
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        stockQuantity: Number(stockQuantity) || 0,
        shortDescription,
        description,
        warrantyMonths: Number(warrantyMonths) || 12,
        emiAvailable,
        images: imageUrl ? [{ url: imageUrl, isMain: true, alt: name }] : undefined,
        specifications: specs.filter((s) => s.name && s.value),
        variants: variants
          .filter((v) => v.name)
          .map((v) => ({
            ...v,
            price: v.price ? Number(v.price) : undefined,
          })),
      };

      await api.post('/products', payload);
      toast.success('Product created and published to live store!');
      router.push('/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/products"
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create New Product
          </h1>
          <p className="text-xs text-slate-500">
            Fills directly into PostgreSQL and updates the live website instantly
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Product Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. iPhone 16 Pro Max"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Product Name (বাংলা)
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="e.g. আইফোন ১৬ প্রো ম্যাক্স"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                SKU (Stock Keeping Unit) *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. APL-IP16PM-256"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="iphone-16-pro-max"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Regular Price (BDT ৳) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="185000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Discount Price (Optional)
              </label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="178000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold text-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Official Warranty (Months)
              </label>
              <input
                type="number"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                placeholder="12"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Product Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or Cloudinary URL"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Key highlights for product card and preview..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Specifications Builder Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-sm text-slate-900">
              2. Technical Specifications
            </h2>
            <button
              type="button"
              onClick={addSpec}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spec Row</span>
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Group (e.g. Display)"
                  value={item.group}
                  onChange={(e) => {
                    const copy = [...specs];
                    copy[idx].group = e.target.value;
                    setSpecs(copy);
                  }}
                  className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Resolution)"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...specs];
                    copy[idx].name = e.target.value;
                    setSpecs(copy);
                  }}
                  className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 2796 x 1290)"
                  value={item.value}
                  onChange={(e) => {
                    const copy = [...specs];
                    copy[idx].value = e.target.value;
                    setSpecs(copy);
                  }}
                  className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(idx)}
                  className="p-2 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Save & Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
