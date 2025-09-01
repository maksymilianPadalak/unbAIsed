'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import StarryAI from './StarryAI';

const navigationItems = [
  {
    name: 'SEARCH',
    href: '/search',
  },
  {
    name: 'COMPANY SCORES',
    href: '/company-scores',
  },
  {
    name: 'AUDITOR AGENT',
    href: '/auditor-agent',
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b-4 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="">
            <div className="border-4 border-white px-3 sm:px-6 py-2 sm:py-3 bg-black hover:bg-white hover:text-black transition-all duration-100">
              <span className="font-mono text-lg sm:text-xl font-black tracking-wider">
                UNB
                <StarryAI />
                SED
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`brutalist-button ${
                    isActive ? 'brutalist-active' : ''
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden border-4 border-white p-2 bg-black hover:bg-white hover:text-black transition-all duration-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t-4 border-white bg-black py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`brutalist-button text-center py-4 ${
                      isActive ? 'brutalist-active' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
