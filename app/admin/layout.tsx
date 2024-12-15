'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminAuth } from "@/components/admin-auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Products', href: '/admin/products', icon: '📦' },
    { name: 'Orders', href: '/admin/orders', icon: '🛍️' },
  ];

  return (
    <AdminAuth>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>
        </header>
        
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <nav className="grid items-start px-4 py-4 text-sm font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  } flex items-center gap-3 rounded-lg px-3 py-2 transition-all`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuth>
  );
}
