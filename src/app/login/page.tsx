'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      router.push('/ai-workspace');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center p-6">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2">
        <div className="bg-primary border-[3px] border-black p-1 shadow-neo">
          <Target className="w-5 h-5 text-black" strokeWidth={3} />
        </div>
        <span className="text-xl font-black tracking-tight text-black">DiscoveryOS</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-3">Welcome Back</h1>
            <p className="text-lg font-bold text-gray-600">Login to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                defaultValue="judge@hackathon.com"
                className="w-full bg-gray-50 border-[3px] border-black px-4 py-3 font-medium outline-none focus:bg-white focus:shadow-neo transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-gray-50 border-[3px] border-black px-4 py-3 font-medium outline-none focus:bg-white focus:shadow-neo transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-accent hover:bg-[#ffe600] text-black border-[3px] border-black px-8 py-4 text-xl font-black shadow-neo transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-neo"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
                  Logging in...
                </>
              ) : (
                <>
                  Login as Guest Judge <ArrowRight strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-[3px] border-black border-dashed text-center">
            <p className="font-bold text-gray-600 text-sm">
              This is a demo environment. No real credentials are required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
