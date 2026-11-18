import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { HOTLINE_NUMBER, SUPPORT_EMAIL, CATEGORIES_LIST, POPULAR_BRANDS } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 text-xs sm:text-sm pt-14 pb-24 md:pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                Z
              </div>
              <span className="text-xl font-black text-white">
                Zynox<span className="text-indigo-500">Gadgets</span>
              </span>
            </Link>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Zynox Gadgets is the premier tech and authentic gadget retail ecosystem in Bangladesh. Genuine smartphones, smartwatches, earbuds, audio gear, and lifestyle tech with official brand warranty and lightning-fast nationwide express delivery.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Hotline: <strong className="text-white">{HOTLINE_NUMBER}</strong> (10 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>Email: {SUPPORT_EMAIL}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>Zynox Tower, Level 4, Dhanmondi 27, Dhaka - 1209, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES_LIST.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-white transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              Help & Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account/orders" className="hover:text-white transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/warranty-policy" className="hover:text-white transition">
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/emi-terms" className="hover:text-white transition">
                  EMI Facilities (0% Interest)
                </Link>
              </li>
              <li>
                <Link href="/return-refund" className="hover:text-white transition">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-white transition">
                  About Us & Outlets
                </Link>
              </li>
            </ul>
          </div>

          {/* Courier & Delivery Partner */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              Delivery Logistics
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Doorstep delivery across all 64 districts of Bangladesh via:
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-300">
              <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800">
                Pathao Courier
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800">
                Steadfast
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800">
                RedX Express
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800">
                Sundarban
              </span>
            </div>

            <div className="mt-6">
              <h5 className="font-bold text-white text-xs mb-2">Delivery Charges</h5>
              <p className="text-xs text-gray-400">
                Inside Dhaka: <strong className="text-white">৳60</strong> (24h)<br />
                Outside Dhaka: <strong className="text-white">৳120</strong> (48h-72h)
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods Banner */}
        <div className="pt-8 pb-6 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs text-gray-400 font-semibold">
              Accepted Payment Methods:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-2 py-1 rounded bg-[#E2136E] text-white">bKash</span>
              <span className="px-2 py-1 rounded bg-[#F7941D] text-white">Nagad</span>
              <span className="px-2 py-1 rounded bg-[#8C3494] text-white">Rocket</span>
              <span className="px-2 py-1 rounded bg-[#00579E] text-white">Upay</span>
              <span className="px-2 py-1 rounded bg-[#1A1F71] text-white">VISA</span>
              <span className="px-2 py-1 rounded bg-[#EB001B] text-white">Mastercard</span>
              <span className="px-2 py-1 rounded bg-[#002663] text-white">AMEX</span>
              <span className="px-2 py-1 rounded bg-emerald-600 text-white">Cash on Delivery</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Powered by SSLCommerz Certified Payment Gateway
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Zynox Gadgets Bangladesh. All Rights Reserved. Fully Owned & Operated in Bangladesh.</p>
          <p>Trade License: TRAD/DNCC/ZYNOX-84920/2026</p>
        </div>
      </div>
    </footer>
  );
}
