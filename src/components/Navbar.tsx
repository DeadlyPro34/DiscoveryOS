'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, userName, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl border-[3px] border-black bg-white z-50 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="px-6 flex items-center justify-between h-16">
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
          
          {mounted && isAuthenticated ? (
            <div className="ml-4 flex items-center gap-3">
              <span className="text-sm font-bold uppercase tracking-wider">{userName || 'User'}</span>
              <button 
                onClick={logout}
                className="p-2 border-[2px] border-black bg-red-100 hover:bg-red-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
                title="Log out"
              >
                <LogOut className="w-4 h-4 text-black" strokeWidth={3} />
              </button>
            </div>
          ) : (
            mounted && (
              <Link
                href="/login"
                className="ml-2 px-4 py-2 text-sm font-bold bg-[#FFE066] text-black border-[2px] border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
