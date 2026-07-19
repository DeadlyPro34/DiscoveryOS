'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#F4F4F0] p-4 text-center">
      <div className="rounded-xl border-[3px] border-black bg-white p-8 shadow-neo max-w-md">
        <h2 className="mb-4 text-2xl font-black">Something went wrong!</h2>
        <p className="mb-6 font-medium text-slate-600">
          We encountered an error while rendering this page.
        </p>
        <p className="mb-6 text-sm text-red-500 font-mono text-left bg-red-50 p-2 border-[2px] border-red-200 rounded">
          {error.message || 'Unknown error'}
        </p>
        <Button
          onClick={() => reset()}
          className="w-full"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
