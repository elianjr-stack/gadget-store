'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../lib/store';

export default function MobileNav() {
  const pathname = usePathname();
  const { cart, wishlist, user } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navItems = [
    { label: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'Categories', href: '/categories', icon: <Grid className="w-5 h-5" /> },
    {
      label: 'Wishlist',
      href: '/wishlist',
      icon: (
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: (
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: user ? 'Account' : 'Login',
      href: user ? '/account' : '/auth/login',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 py-2 px-4 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
