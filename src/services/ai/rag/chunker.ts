/**
 * Chunks text into smaller pieces
 * @param text The text to chunk
 * @param chunkSize Target size of each chunk
 * @param overlap Overlap size between chunks
 * @returns Array of text chunks
 */
export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\s*\n/);

  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length <= chunkSize) {
      currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      
      // If a single paragraph is larger than chunk size, split by sentences
      if (paragraph.length > chunkSize) {
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        currentChunk = '';
        
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length <= chunkSize) {
            currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
          } else {
            if (currentChunk.length > 0) {
              chunks.push(currentChunk);
            }
            currentChunk = sentence;
          }
        }
      } else {
        currentChunk = paragraph;
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  // Handle overlap if needed (simplified for the basic chunker)
  // For production, a more sophisticated overlapping sliding window might be used.
  
  return chunks;
}
