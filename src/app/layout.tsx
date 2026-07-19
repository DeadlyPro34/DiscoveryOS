import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
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
        <div className="min-h-screen">
          {/* Navigation Bar */}
          <nav className="border-b-[3px] border-black bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight">
                  🧠 DiscoveryOS
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm font-bold rounded-lg hover:bg-[#FFE066] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="px-3 py-1.5 text-sm font-bold rounded-lg hover:bg-[#FFE066] transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/ai-workspace"
                  className="px-3 py-1.5 text-sm font-bold rounded-lg bg-[#38DBFF] border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
                >
                  🤖 AI Workspace
                </Link>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
