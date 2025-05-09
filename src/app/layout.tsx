// src/app/layout.tsx
'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import TopNavbar from '@/components/TopNavbar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { PageWrapper } from '@/components/PageWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import './globals.css';

function RootContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {status === 'authenticated' && <TopNavbar />}
      {status === 'authenticated' && isDashboard && <DashboardNavbar />}
      <main className={status === 'authenticated' && isDashboard ? 'pt-24' : status === 'authenticated' ? 'pt-12' : ''}>
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
          <PageWrapper>{children}</PageWrapper>
        </div>
      </main>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            <RootContent>{children}</RootContent>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}