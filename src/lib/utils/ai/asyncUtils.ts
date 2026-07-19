/**
 * Async Utilities
 * Provides retry logic, exponential backoff, and timeout handlers for async operations
 */

/**
 * Configuration for retry strategy
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFactor: number;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
};

/**
 * Calculate delay for retry with exponential backoff
 * @param attempt - The current attempt number (0-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 */
export function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  // Calculate exponential backoff
  const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);

  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);

  // Add jitter to prevent thundering herd
  const jitter = cappedDelay * config.jitterFactor * Math.random();

  return cappedDelay + jitter;
}

/**
 * Sleep for specified milliseconds
 * @param ms - Milliseconds to sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with exponential backoff
 * @param fn - Async function to retry
 * @param config - Retry configuration
 * @param onRetry - Optional callback on retry
 * @returns Promise with the result of fn
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  onRetry?: (attempt: number, error: Error, nextDelayMs: number) => void
): Promise<T> {
  const mergedConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= mergedConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < mergedConfig.maxRetries) {
        const delayMs = calculateBackoffDelay(attempt, mergedConfig);
        if (onRetry) {
          onRetry(attempt, lastError, delayMs);
        }
        await sleep(delayMs);
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Timeout configuration
 */
export interface TimeoutOptions {
  timeoutMs: number;
  abortSignal?: AbortSignal;
}

/**
 * Add timeout to a promise
 * @param promise - Promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param timeoutMessage - Optional custom timeout error message
 * @returns Promise that rejects if timeout is exceeded
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

/**
 * Execute async function with timeout
 * @param fn - Async function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise with the result of fn
 */
export async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  return withTimeout(fn(), timeoutMs);
}

/**
 * Race multiple promises with timeout
 * @param promises - Promises to race
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise with the result of the first resolved promise
 */
export async function raceWithTimeout<T>(promises: Promise<T>[], timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Race operation timed out'));
    }, timeoutMs);
  });

  return Promise.race([...promises, timeoutPromise]);
}

/**
 * Execute async function and ignore errors (fire and forget)
 * @param fn - Async function to execute
 * @param onError - Optional error handler
 */
export function fireAndForget(fn: () => Promise<void>, onError?: (error: Error) => void): void {
  fn().catch((error) => {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

/**
 * Debounce an async function
 * @param fn - Async function to debounce
 * @param delayMs - Delay in milliseconds
 * @returns Debounced function
 */
export function debounceAsync<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  delayMs: number
): (...args: Args) => Promise<R> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastPromise: Promise<R> | null = null;

  return function (...args: Args): Promise<R> {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          lastPromise = fn(...args);
          const result = await lastPromise;
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delayMs);
    });
  };
}

/**
 * Throttle an async function
 * @param fn - Async function to throttle
 * @param delayMs - Delay in milliseconds between invocations
 * @returns Throttled function
 */
export function throttleAsync<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  delayMs: number
): (...args: Args) => Promise<R> {
  let lastCallTime = 0;
  let pendingPromise: Promise<R> | null = null;

  return async function (...args: Args): Promise<R> {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= delayMs) {
      lastCallTime = now;
      pendingPromise = fn(...args);
      return pendingPromise;
    }

    if (pendingPromise) {
      return pendingPromise;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          pendingPromise = fn(...args);
          pendingPromise.then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      }, delayMs - timeSinceLastCall);
    });
  };
}

/**
 * Batch async operations with concurrency limit
 * @param items - Items to process
 * @param fn - Async function to apply to each item
 * @param concurrency - Maximum concurrent operations
 * @returns Promise with array of results
 */
export async function batchAsync<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number = 1
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = Promise.resolve().then(async () => {
      const result = await fn(item);
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Pool async operations
 * @param fn - Async function to execute
 * @param poolSize - Size of the pool
 * @returns Object with queue and execute methods
 */
export function createAsyncPool<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  poolSize: number = 1
) {
  let executing = 0;
  const queue: Array<{
    args: Args;
    resolve: (result: R) => void;
    reject: (error: Error) => void;
  }> = [];

  const execute = async (args: Args): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (executing < poolSize) {
        executing++;
        fn(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            executing--;
            if (queue.length > 0) {
              const next = queue.shift();
              if (next) {
                execute(next.args).then(next.resolve).catch(next.reject);
              }
            }
          });
      } else {
        queue.push({ args, resolve, reject });
      }
    });
  };

  return { execute, queue };
}
