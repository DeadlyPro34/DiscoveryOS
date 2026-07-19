'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <button
            onClick={() => reset()}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
