// src/components/AuthenticatedLayout.tsx
'use client';

import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1 pt-14 overflow-auto">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}