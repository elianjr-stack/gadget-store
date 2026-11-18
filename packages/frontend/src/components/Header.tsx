'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Heart, User, Phone, Menu, X, ChevronDown,
  Layers, Flame, Smartphone, Watch, Headphones, Laptop, Tablet, Sparkles
} from 'lucide-react';
import SearchBar from './SearchBar';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useStore } from '../lib/store';
import { useLanguage } from '../hooks/useLanguage';
import { HOTLINE_NUMBER, CATEGORIES_LIST, POPULAR_BRANDS } from '../lib/constants';

export default function Header() {
  const { lang, t } = useLanguage();
  const { cart, wishlist, user, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      {/* ── Top Bar ── */}
      <div className="bg-gray-900 text-gray-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${HOTLINE_NUMBER}`}
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.hotline}: <strong className="text-white">{HOTLINE_NUMBER}</strong></span>
            </a>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">
              Free Express Delivery Inside Dhaka Above ৳2,000
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/account/orders" className="hover:text-white transition">
              {t.trackOrder}
            </Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-1 font-semibold text-emerald-400">
              <span>Currency: <strong>BDT (৳)</strong></span>
            </div>
            <span className="text-gray-600">|</span>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/25">
                Z
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white">
                  Zynox<span className="text-indigo-600">Gadgets</span>
                </span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1 uppercase">
                  Bangladesh
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchBar />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="md:hidden">
              <ThemeToggle />
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title={t.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold hover:bg-primary-100 dark:hover:bg-primary-900 transition"
              title={t.cart}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs sm:text-sm hidden sm:inline">{t.cart}</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                  {user.name?.[0] || 'U'}
                </div>
                <span className="text-xs font-semibold hidden lg:inline max-w-[90px] truncate">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <User className="w-4 h-4" />
                <span>{t.login}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* ── Category Mega Bar (Desktop) ── */}
      <div className="bg-gray-50 dark:bg-gray-950/60 border-t border-gray-100 dark:border-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-1">
            {/* Mega Menu Toggle */}
            <div className="relative group">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-t-lg font-bold hover:bg-primary-700 transition"
              >
                <Layers className="w-4 h-4" />
                <span>{t.allCategories}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-b-2xl py-2 hidden group-hover:block z-50 divide-y divide-gray-100 dark:divide-gray-800">
                {CATEGORIES_LIST.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 transition"
                  >
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <Link
              href="/products"
              className="px-3.5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              All Products
            </Link>
            <Link
              href="/categories/smartphones"
              className="px-3.5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Smartphones
            </Link>
            <Link
              href="/categories/smart-watches"
              className="px-3.5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Smart Watches
            </Link>
            <Link
              href="/categories/earbuds-headphones"
              className="px-3.5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Earbuds & Audio
            </Link>
            <Link
              href="/brands"
              className="px-3.5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              All Brands
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/deals"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold hover:scale-105 transition"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{t.flashDeals}</span>
            </Link>
            <Link
              href="/pre-order"
              className="px-3 py-1 text-primary-600 dark:text-primary-400 hover:underline"
            >
              {t.preOrder}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer Navigation ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <LanguageToggle />
            <div className="text-xs text-gray-500">
              Hotline: <strong>{HOTLINE_NUMBER}</strong>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
              Categories
            </p>
            {CATEGORIES_LIST.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <Link
              href="/deals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <Flame className="w-4 h-4" />
              <span>{t.flashDeals}</span>
            </Link>
            <Link
              href="/brands"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              {t.allBrands}
            </Link>
            <Link
              href="/pre-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              {t.preOrder}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
