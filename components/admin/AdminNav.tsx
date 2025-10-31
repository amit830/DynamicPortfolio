'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/skills', label: 'Skills' },
    { href: '/admin/experience', label: 'Experience' },
    { href: '/admin/testimonials', label: 'Testimonials' },
    { href: '/admin/messages', label: 'Messages' },
  ];

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  pathname === item.href
                    ? 'border-white'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-gray-300"
            >
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium hover:text-gray-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
