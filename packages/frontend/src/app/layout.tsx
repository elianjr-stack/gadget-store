import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '../components/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import WhatsAppButton from '../components/WhatsAppButton';
import CompareDrawer from '../components/CompareDrawer';
import ProductQuickView from '../components/ProductQuickView';

export const metadata: Metadata = {
  title: 'Zynox Gadgets | Premier Tech & Gadget Destination in Bangladesh',
  description:
    'Shop authentic smartphones, smartwatches, earbuds, laptops, chargers, and tech lifestyle accessories with official warranty and fastest delivery across Bangladesh.',
  keywords: [
    'zynox gadgets',
    'gadget store bangladesh',
    'apple gadgets bd',
    'smartphones bd',
    'smart watch price in bangladesh',
    'iphone 15 pro max price in bangladesh',
    'bKash online payment gadgets',
  ],
  authors: [{ name: 'Zynox Gadgets' }],
  metadataBase: new URL('https://zynoxgadgets.com'),
  openGraph: {
    title: 'Zynox Gadgets | Premier Tech & Gadget Destination in Bangladesh',
    description: 'Premier gadget shopping in Bangladesh. 100% genuine products with official brand warranties.',
    type: 'website',
    locale: 'en_BD',
    siteName: 'Zynox Gadgets',
  },
};

export const viewport: Viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col antialiased selection:bg-primary-500 selection:text-white">
        <Providers>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {children}
          </main>
          <Footer />
          <MobileNav />
          <CompareDrawer />
          <WhatsAppButton />
          <ProductQuickView />
        </Providers>
      </body>
    </html>
  );
}
