import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '../components/Navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  title: {
    default: 'UnbAIsed — Research company ethics with AI',
    template: '%s | UnbAIsed',
  },
  description:
    'Research companies with GPT-5 network search and see ethics scores based on cited research.',
  keywords: [
    'company ethics',
    'ethics score',
    'AI research',
    'GPT-5',
    'Weaviate',
    'corporate transparency',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'UnbAIsed',
    title: 'UnbAIsed — Research company ethics with AI',
    description:
      'Research companies with GPT-5 network search and see ethics scores based on cited research.',
    images: [
      {
        url: '/meta.webp',
        width: 1200,
        height: 630,
        alt: 'UnbAIsed — Research companies with AI. Ethics scores based on cited research.',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UnbAIsed — Research company ethics with AI',
    description:
      'Research companies with GPT-5 network search and see ethics scores based on cited research.',
    images: ['/meta.webp'],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1 min-h-0">{children}</main>
      </body>
    </html>
  );
}
