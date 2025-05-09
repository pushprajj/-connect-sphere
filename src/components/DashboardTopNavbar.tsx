import React from 'react';
import Image from 'next/image';

interface DashboardTopNavbarProps {
  businessName: string;
  businessLogo: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Products', href: '/dashboard/products' },
  { label: 'People', href: '/dashboard/people' },
  // Add more as needed
];

export default function DashboardTopNavbar({ businessName, businessLogo }: DashboardTopNavbarProps) {
  return (
    <nav className="w-full bg-white border-t border-gray-200 flex items-center px-6 h-14" style={{ minHeight: 48, marginTop: 0 }}>
      <div className="flex items-center mr-8 min-w-[220px]">
        {businessLogo && (
          <Image src={businessLogo} alt="Logo" width={32} height={32} className="rounded" />
        )}
        <span className="ml-3 font-semibold text-lg text-gray-900">{businessName}</span>
      </div>
      <div className="flex space-x-6">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center text-gray-800 hover:text-indigo-600 font-medium px-2 py-1 rounded transition-colors"
            style={{ fontSize: '1rem' }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
