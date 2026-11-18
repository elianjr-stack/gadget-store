'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../lib/constants';
import { useLanguage } from '../hooks/useLanguage';

export default function WhatsAppButton() {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello Zynox Gadgets, I would like to inquire about your products.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group">
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline font-semibold text-sm">
          {t.whatsappChat}
        </span>
      </button>
    </div>
  );
}
