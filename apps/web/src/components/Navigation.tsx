'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Github } from 'lucide-react';
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
  {
    name: 'OUR MISSION',
    href: '/our-mission',
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    if (!menuRef.current) return;
    if (isMobileMenuOpen) {
      setMenuHeight(menuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (menuRef.current && isMobileMenuOpen) {
        setMenuHeight(menuRef.current.scrollHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-black border-b-4 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <Link href="/" className="">
              <div className="border-4 border-white px-3 sm:px-6 h-12 sm:h-14 flex items-center bg-black hover:bg-white hover:text-black transition-all duration-100">
                <span className="font-mono text-lg sm:text-xl font-black tracking-wider">
                  UNB
                  <StarryAI />
                  SED
                </span>
              </div>
            </Link>
            <a
              href="https://github.com/maksymilianPadalak/unbAIsed"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open-source on GitHub"
              className="border-4 border-white h-12 sm:h-14 w-12 sm:w-14 bg-black hover:bg-white hover:text-black transition-all duration-100 inline-flex items-center justify-center"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>

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
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          ref={menuRef}
          aria-hidden={!isMobileMenuOpen}
          className={`lg:hidden border-t-4 border-white bg-black overflow-hidden origin-top transform-gpu transition-[max-height,opacity,transform] duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
          }`}
          style={{ maxHeight: isMobileMenuOpen ? menuHeight : 0 }}
        >
          <div className="flex flex-col space-y-1 py-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`brutalist-button text-center ${
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
      </div>
    </nav>
  );
}
