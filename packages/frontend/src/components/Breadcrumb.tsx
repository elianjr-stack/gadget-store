import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-3 mb-4 overflow-x-auto whitespace-nowrap">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-400 flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
