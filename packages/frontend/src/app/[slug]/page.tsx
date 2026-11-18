'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '../../components/Breadcrumb';
import { ShieldCheck, CreditCard, RefreshCw, FileText, Info } from 'lucide-react';
import { HOTLINE_NUMBER, STORE_ADDRESS, SUPPORT_EMAIL } from '../../lib/constants';

const CMS_PAGES: Record<string, { title: string; icon: any; content: string[] }> = {
  'warranty-policy': {
    title: 'Warranty Policy & Terms',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
    content: [
      'Zynox Gadgets guarantees that all official gadgets sold are covered by the respective manufacturer or official distributor warranty in Bangladesh.',
      'Official products come with 12 to 24 months manufacturer warranty servicing.',
      'We offer a 7-day replacement guarantee in case of verified factory hardware issues or dead-on-arrival equipment.',
      'Physical breakage, liquid/water damage, power surge burning, and unauthorized repairs are strictly not covered under standard warranty.',
    ],
  },
  'emi-terms': {
    title: 'EMI (Equated Monthly Installment) Facilities',
    icon: <CreditCard className="w-8 h-8 text-primary-500" />,
    content: [
      'Enjoy 0% interest EMI on orders above ৳10,000 for up to 12 months with leading Bangladeshi credit cards.',
      'Supported banks include City Bank (Amex), Standard Chartered, Eastern Bank, BRAC Bank, Dutch-Bangla Bank, Dhaka Bank, Mutual Trust Bank, and Southeast Bank.',
      'Online EMI can be selected at the checkout stage via the SSLCommerz gateway or processed in-store during delivery.',
    ],
  },
  'return-refund': {
    title: 'Return & Refund Policy',
    icon: <RefreshCw className="w-8 h-8 text-amber-500" />,
    content: [
      'Customers can request a product return or exchange within 7 days of receiving the parcel if the product is defective or does not match the specifications ordered.',
      'The item must be unused, in its original brand box, with all original tags, manuals, and accessories intact.',
      'Once the return is inspected and approved at our central warehouse, refunds are initiated via the original payment method (bKash/Nagad or Card) within 3-7 business days.',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    icon: <FileText className="w-8 h-8 text-indigo-500" />,
    content: [
      'We value your privacy. We only collect details essential for order fulfillment, courier delivery, and account security.',
      'We do not sell, rent, or share customer telephone numbers or email addresses with third-party advertisers.',
      'All credit card and mobile banking transactions are processed via SSL-encrypted certified payment partners.',
    ],
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    icon: <FileText className="w-8 h-8 text-gray-500" />,
    content: [
      'By placing an order on Zynox Gadgets, you confirm that your provided contact details and delivery addresses are authentic.',
      'Prices displayed are inclusive of taxes and are quoted in Bangladeshi Taka (BDT). Prices are subject to market adjustments without prior notice.',
      'In rare events of catalog pricing errors or sudden out-of-stock situations, Zynox Gadgets reserves the right to cancel or adjust the order with immediate customer notification.',
    ],
  },
  'about-us': {
    title: 'About Zynox Gadgets',
    icon: <Info className="w-8 h-8 text-primary-600" />,
    content: [
      'Zynox Gadgets was established with one mission: to deliver genuine, high-performance tech gadgets and accessories to tech enthusiasts across Bangladesh at fair prices.',
      'We maintain direct relationships with authorized distributors for Apple, Samsung, Xiaomi, Realme, Anker, Baseus, Amazfit, Oraimo, and other leading global tech brands.',
      `Visit our flagship outlet at ${STORE_ADDRESS}, or order online for fast home delivery across all 64 districts.`,
    ],
  },
};

export default function CmsDynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const pageData = CMS_PAGES[slug] || {
    title: 'Customer Information',
    icon: <Info className="w-8 h-8 text-primary-600" />,
    content: [
      'Welcome to Zynox Gadgets customer knowledgebase.',
      `For any questions regarding ${slug}, please reach our hotline at ${HOTLINE_NUMBER} or email ${SUPPORT_EMAIL}.`,
    ],
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <Breadcrumb items={[{ label: pageData.title }]} />

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
            {pageData.icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
              {pageData.title}
            </h1>
            <p className="text-xs text-gray-400">Official Zynox Gadgets Guidelines</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {pageData.content.map((paragraph, idx) => (
            <p key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
