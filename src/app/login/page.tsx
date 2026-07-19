'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get('tab') === 'signup';
  
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('John Doe');
  const { login } = useAuthStore();

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(isSignUp ? name : 'Demo User');
      router.push('/projects');
    } catch (err) {
      setError('Login failed. Please check your database connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center p-6">
      {/* Removed the absolute logo since we have a global floating navbar */}

      <div className="w-full max-w-md">
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-3">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-lg font-bold text-gray-600">{isSignUp ? 'Sign up for a workspace' : 'Login to your workspace'}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-100 border-[3px] border-red-500 text-red-700 p-3 font-bold text-sm">
                {error}
              </div>
            )}
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-gray-50 border-[3px] border-black px-4 py-3 font-medium outline-none focus:bg-white focus:shadow-neo transition-all"
                  required
                />
              </div>
            )}
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
                  {isSignUp ? 'Creating account...' : 'Logging in...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {isSignUp ? (
              <p className="font-bold text-gray-700">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign In
                </Link>
              </p>
            ) : (
              <p className="font-bold text-gray-700">
                Don't have an account?{' '}
                <Link href="/login?tab=signup" className="text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            )}
          </div>

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
