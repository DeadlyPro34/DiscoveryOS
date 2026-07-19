import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Display */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black text-black">
            404
          </h1>
          <div className="border-l-[6px] border-accent pl-6 py-2">
            <p className="text-2xl md:text-3xl font-black text-black">
              Page Not Found
            </p>
            <p className="text-lg text-gray-600 font-semibold mt-2">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
        </div>

        {/* Suggested Links */}
        <div className="space-y-3 pt-6">
          <p className="text-sm font-bold text-gray-600">Try visiting:</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 border-[3px] border-black px-6 py-3 font-bold shadow-neo transition-transform hover:-translate-y-1">
                <Home size={18} strokeWidth={3} />
                Dashboard
              </button>
            </Link>
            <Link href="/projects">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-yellow-300 text-black border-[3px] border-black px-6 py-3 font-bold shadow-neo transition-transform hover:-translate-y-1">
                Projects
              </button>
            </Link>
            <Link href="/ai-workspace">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-cyan-300 text-black border-[3px] border-black px-6 py-3 font-bold shadow-neo transition-transform hover:-translate-y-1">
                🤖 AI Workspace
              </button>
            </Link>
          </div>
        </div>

        {/* Error Details */}
        <div className="bg-gray-100 border-[3px] border-black p-6 shadow-neo text-left">
          <p className="text-sm font-mono text-gray-700">
            <span className="font-black text-black">Error:</span> The requested resource does not exist.
          </p>
          <p className="text-xs text-gray-600 mt-2 font-semibold">
            If you believe this is a mistake, please{' '}
            <Link href="/" className="text-black underline font-bold">
              return to home
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
