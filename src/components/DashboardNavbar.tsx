import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Products', href: '/products' },
  { label: 'Sales', href: '/dashboard/sales' },
  { label: 'Procurement', href: '/dashboard/procurement' },
  { label: 'People', href: '/dashboard/people' },
  { label: 'Intranet', href: '/dashboard/intranet' },
  { label: 'Resources', href: '/dashboard/resources' },
];

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const businessName = session?.user?.business_name || 'Your Business';
  const businessLogo = session?.user?.business_logo || session?.user?.image || '/default-logo.png';

  return (
    <nav className="fixed top-12 left-0 right-0 w-full bg-white border-t border-b border-gray-200 h-12 flex items-center z-10">
      <div className="mx-auto max-w-[1128px] px-6 w-full flex items-center h-full">
        <div className="flex items-center mr-6">
          {businessLogo && (
            <Image src={businessLogo} alt="Logo" width={48} height={48} className="rounded" />
          )}
          <span className="ml-3 font-semibold text-lg text-gray-900">{businessName}</span>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-6 justify-center flex-shrink-0" style={{ minWidth: '300px' }}>
          {navItems.map((item) => {
            const pathname = usePathname();
            const isActive = pathname === item.href;
            return (
              <div key={item.href} className="relative flex flex-col items-center">
                <Link
                  href={item.href}
                  className={`flex items-center ${isActive ? 'text-indigo-600' : 'text-gray-800'} hover:text-indigo-600 font-medium px-2 py-1 rounded transition-colors`}
                  style={{ fontSize: '1rem' }}
                >
                  {item.label}
                </Link>
                {isActive && (
                  <div className="absolute -bottom-3 h-0.5 w-full bg-indigo-600"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
