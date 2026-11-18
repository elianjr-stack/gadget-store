import React from 'react';

interface SpecificationItem {
  id?: string;
  group: string;
  name?: string;
  label?: string;
  value: string;
}

interface ProductSpecsProps {
  specifications: SpecificationItem[];
}

export default function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-6 text-center">
        No detailed specifications available for this product yet.
      </div>
    );
  }

  // Group specs by group name
  const grouped: Record<string, SpecificationItem[]> = {};
  specifications.forEach((spec) => {
    const grp = spec.group || 'General';
    if (!grouped[grp]) grouped[grp] = [];
    grouped[grp].push(spec);
  });

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([groupTitle, items]) => (
        <div key={groupTitle} className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="bg-gray-50 dark:bg-gray-800/60 px-4 py-2.5 font-bold text-sm text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            {groupTitle}
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-3 px-4 py-3 text-xs sm:text-sm hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
              >
                <span className="font-semibold text-gray-600 dark:text-gray-400">
                  {item.name || item.label}
                </span>
                <span className="sm:col-span-2 text-gray-900 dark:text-gray-100 font-medium mt-0.5 sm:mt-0">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
