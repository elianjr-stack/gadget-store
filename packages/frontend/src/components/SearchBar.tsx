'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { api } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

interface SuggestionItem {
  name: string;
  nameBn?: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images?: { url: string }[];
  brand?: { name: string };
}

export default function SearchBar() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    api
      .get(`/products/search/suggest?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res: any) => {
        if (isMounted) {
          setSuggestions(res.data || []);
        }
      })
      .catch(() => {
        if (isMounted) setSuggestions([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 pl-11 pr-10 py-2.5 rounded-full text-sm border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all shadow-inner"
        />
        <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Autosuggest Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Searching gadgets...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Matching Gadgets
              </div>
              {suggestions.map((item) => {
                const img = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120';
                return (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img src={img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {lang === 'bn' && item.nameBn ? item.nameBn : item.name}
                      </p>
                      {item.brand && (
                        <p className="text-xs text-gray-400">{item.brand.name}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(item.discountPrice || item.price)}
                      </span>
                    </div>
                  </Link>
                );
              })}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <span>View all results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No gadgets found matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
