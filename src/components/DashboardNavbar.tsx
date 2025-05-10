import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBox, FiBarChart2, FiShoppingCart, FiUsers, FiGlobe, FiFolder } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <FiHome size={22}/> },
  { label: 'Products', href: '/products', icon: <FiBox size={22}/> },
  { label: 'Sales', href: '/dashboard/sales', icon: <FiBarChart2 size={22}/> },
  { label: 'Procurement', href: '/dashboard/procurement', icon: <FiShoppingCart size={22}/> },
  { label: 'People', href: '/dashboard/people', icon: <FiUsers size={22}/> },
  { label: 'Intranet', href: '/dashboard/intranet', icon: <FiGlobe size={22}/> },
  { label: 'Resources', href: '/dashboard/resources', icon: <FiFolder size={22}/> },
];

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const businessName = session?.user?.business_name || 'Your Business';
  const businessLogo = session?.user?.business_logo || session?.user?.image || '/default-logo.png';

  const pathname = usePathname();
  return (
    <aside className="fixed top-12 left-0 h-[calc(100%-3rem)] w-64 bg-white border-r border-gray-200 flex flex-col z-20">
      <div className="flex items-center px-6 py-6 border-b border-gray-100">
        {businessLogo && (
          <Image src={businessLogo} alt="Logo" width={40} height={40} className="rounded" />
        )}
        <span className="ml-3 font-semibold text-lg text-gray-900 whitespace-nowrap">{businessName}</span>
      </div>
      <nav className="flex-1 flex flex-col py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 my-1 rounded-lg transition-colors text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600' : 'text-gray-800 hover:bg-gray-100'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
