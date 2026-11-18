'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, CreditCard, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium Design. A17 Pro Chip. The Ultimate Flagship.',
    price: 'From ৳1,78,000',
    link: '/products/iphone-15-pro-max',
    badge: 'Flagship Launch',
    bg: 'from-slate-950 via-indigo-950 to-slate-900',
    accent: 'text-indigo-400',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000',
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Galaxy AI is here. 200MP Camera with Built-in S-Pen.',
    price: 'From ৳1,58,000',
    link: '/products/samsung-galaxy-s24-ultra',
    badge: 'Exclusive Offer',
    bg: 'from-gray-950 via-zinc-900 to-black',
    accent: 'text-cyan-400',
    image: 'https://images.unsplash.com/photo-1707930524337-408abc9f8fd0?w=1000',
  },
  {
    title: 'MacBook Air M3',
    subtitle: 'Lean. Mean. M3 Machine. Up to 18 Hours Battery Life.',
    price: 'From ৳1,38,000',
    link: '/products/macbook-air-m3-13-inch',
    badge: 'Apple Official',
    bg: 'from-blue-950 via-slate-900 to-indigo-950',
    accent: 'text-sky-400',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="space-y-4">
      {/* Hero Carousel */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${slide.bg} text-white min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex items-center transition-all duration-700 shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Text Content */}
          <div className="space-y-4 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white">
              {slide.badge}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-md">
              {slide.subtitle}
            </p>

            <div className="text-xl sm:text-2xl font-extrabold text-amber-400">
              {slide.price}
            </div>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-950 font-bold text-sm hover:bg-gray-100 transition shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm transition"
              >
                Explore Catalog
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 md:h-96 flex items-center justify-center">
            <img
              src={slide.image}
              alt={slide.title}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transition-all duration-700 transform hover:scale-105"
            />
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition hidden sm:block"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition hidden sm:block"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === i ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              100% Authentic
            </h4>
            <p className="text-[11px] text-gray-400">Official & Global Gadgets</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              Fastest Delivery
            </h4>
            <p className="text-[11px] text-gray-400">24H Inside Dhaka, 48H Outside</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              Official Warranty
            </h4>
            <p className="text-[11px] text-gray-400">Up to 12-24 Months Coverage</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              EMI & bKash
            </h4>
            <p className="text-[11px] text-gray-400">0% Interest EMI up to 12 Mos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
