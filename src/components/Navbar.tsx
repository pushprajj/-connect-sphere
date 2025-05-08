// src/components/Navbar.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  const businessName = session?.user?.business_name || 'Your Business';

  return (
    <nav className="w-64 bg-white shadow-md p-6 flex flex-col"> {/* p-6 inside */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">{businessName}</h2>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/products" className="text-gray-600 hover:text-indigo-600">
              Products
            </Link>
          </li>
          <li>
            <Link href="/people" className="text-gray-600 hover:text-indigo-600">
              People
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}