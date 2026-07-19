import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

export const metadata: Metadata = {
  title: 'DiscoveryOS - AI Product Discovery Platform',
  description: 'Every product decision backed by customer evidence',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <div className="min-h-screen">
            {/* Navigation Bar */}
          <Navbar />
            <main>{children}</main>
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
