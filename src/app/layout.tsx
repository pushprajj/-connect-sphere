// src/app/layout.tsx
'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import TopNavbar from '@/components/TopNavbar';
import { PageWrapper } from '@/components/PageWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

function RootContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {status === 'authenticated' && <TopNavbar />}
      <main className={status === 'authenticated' ? 'pt-12' : ''}>
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