"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    name: "SEARCH",
    href: "/search",
  },
  {
    name: "COMPANY SCORES", 
    href: "/company-scores",
  },
  {
    name: "AUDITOR AGENT",
    href: "/auditor-agent",
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-black border-b-4 border-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="">
            <div className="border-4 border-white px-6 py-3 bg-black hover:bg-white hover:text-black transition-all duration-100">
              <span className="font-mono text-xl font-black tracking-wider">UNBIASED</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`brutalist-button ${
                    isActive ? "brutalist-active" : ""
                  }`}
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
