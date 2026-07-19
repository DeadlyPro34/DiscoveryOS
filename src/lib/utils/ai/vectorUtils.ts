/**
 * Vector utilities for DiscoveryOS.
 * Handles vector operations and similarity calculations.
 */

/**
 * Calculates cosine similarity between two vectors.
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Cosine similarity score (0-1)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have equal length');
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Calculates Euclidean distance between two vectors.
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Euclidean distance
 */
export function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have equal length');
  }

  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    const diff = vec1[i] - vec2[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * Finds top-k most similar vectors.
 * @param queryVec - Query vector
 * @param vectors - Array of vectors to search
 * @param k - Number of results to return
 * @returns Array of [index, similarity] tuples
 */
export function topKSimilar(
  queryVec: number[],
  vectors: number[][],
  k: number
): Array<[number, number]> {
  const similarities = vectors.map((vec, idx) => [
    idx,
    cosineSimilarity(queryVec, vec),
  ] as [number, number]);

  return similarities.sort((a, b) => b[1] - a[1]).slice(0, k);
}

/**
 * Normalizes a vector to unit length.
 * @param vec - Vector to normalize
 * @returns Normalized vector
 */
export function normalizeVector(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vec;
  return vec.map((val) => val / magnitude);
}

/**
 * Generates a mock embedding vector.
 * Used for testing and demonstration purposes.
 * @param text - Text to generate embedding for
 * @param dimension - Vector dimension (default 384)
 * @returns Mock embedding vector
 */
export function generateMockEmbedding(
  text: string,
  dimension: number = 384
): number[] {
  // Use hash-based approach for deterministic but pseudo-random values
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const embedding: number[] = [];
  for (let i = 0; i < dimension; i++) {
    hash = (hash * 9301 + 49297) % 233280;
    embedding.push(((hash / 233280) * 2 - 1) * 0.5);
  }

  return normalizeVector(embedding);
}
