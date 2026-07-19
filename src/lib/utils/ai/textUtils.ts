/**
 * Text utilities for RAG pipeline.
 * Handles text normalization, tokenization, encoding detection, and text splitting.
 */

import { estimateTokenCount, countWords } from './tokenizer';

/**
 * Detects character encoding of text.
 * Returns the most likely encoding.
 * @param buffer - Buffer or string to detect encoding for
 * @returns Encoding name (e.g., 'utf-8', 'utf-16', 'iso-8859-1')
 */
export function detectEncoding(buffer: Buffer | string): string {
  // Convert string to buffer if needed
  const buf = typeof buffer === 'string' ? Buffer.from(buffer) : buffer;

  // Check for BOM (Byte Order Mark)
  if (buf.length >= 4) {
    if (
      buf[0] === 0xff &&
      buf[1] === 0xfe &&
      buf[2] === 0x00 &&
      buf[3] === 0x00
    ) {
      return 'utf-32-le';
    }
    if (
      buf[0] === 0x00 &&
      buf[1] === 0x00 &&
      buf[2] === 0xfe &&
      buf[3] === 0xff
    ) {
      return 'utf-32-be';
    }
  }

  if (buf.length >= 3) {
    if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
      return 'utf-8';
    }
  }

  if (buf.length >= 2) {
    if (buf[0] === 0xff && buf[1] === 0xfe) {
      return 'utf-16-le';
    }
    if (buf[0] === 0xfe && buf[1] === 0xff) {
      return 'utf-16-be';
    }
  }

  // UTF-8 detection without BOM
  if (isValidUtf8(buf)) {
    return 'utf-8';
  }

  // Check for other common encodings
  if (isValidISO88591(buf)) {
    return 'iso-8859-1';
  }

  if (isValidWindows1252(buf)) {
    return 'windows-1252';
  }

  // Default to UTF-8
  return 'utf-8';
}

/**
 * Validates if buffer is valid UTF-8.
 * @param buf - Buffer to validate
 * @returns True if valid UTF-8
 */
function isValidUtf8(buf: Buffer): boolean {
  let i = 0;
  while (i < buf.length) {
    const byte = buf[i];

    if (byte === 0) {
      i++;
      continue;
    }

    // Single byte (0xxxxxxx)
    if ((byte & 0x80) === 0) {
      i++;
      // Two byte sequence
    } else if ((byte & 0xe0) === 0xc0) {
      if (i + 1 >= buf.length) return false;
      i += 2;
      // Three byte sequence
    } else if ((byte & 0xf0) === 0xe0) {
      if (i + 2 >= buf.length) return false;
      i += 3;
      // Four byte sequence
    } else if ((byte & 0xf8) === 0xf0) {
      if (i + 3 >= buf.length) return false;
      i += 4;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * Validates if buffer is valid ISO-8859-1 (Latin-1).
 * @param buf - Buffer to validate
 * @returns True if valid ISO-8859-1
 */
function isValidISO88591(buf: Buffer): boolean {
  // ISO-8859-1 accepts any byte value 0-255
  // Just check if it's not obviously UTF-8
  return !isValidUtf8(buf);
}

/**
 * Validates if buffer is valid Windows-1252.
 * @param buf - Buffer to validate
 * @returns True if valid Windows-1252
 */
function isValidWindows1252(buf: Buffer): boolean {
  // Windows-1252 is similar to ISO-8859-1 with some additional characters
  // For now, we'll treat it like ISO-8859-1
  return !isValidUtf8(buf);
}

/**
 * Normalizes whitespace in text.
 * Removes extra spaces, tabs, and normalizes line breaks.
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeWhitespace(text: string): string {
  return (
    text
      // Convert all whitespace sequences to single space (except newlines)
      .replace(/[ \t\r]+/g, ' ')
      // Normalize multiple newlines to double newline
      .replace(/\n\n\n+/g, '\n\n')
      // Remove trailing whitespace from lines
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      // Remove leading/trailing whitespace
      .trim()
  );
}

/**
 * Normalizes text formatting.
 * Handles smart quotes, dashes, ellipsis, etc.
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeFormatting(text: string): string {
  return (
    text
      // Convert smart quotes to regular quotes
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // Convert em dashes to hyphens
      .replace(/[\u2013\u2014]/g, '-')
      // Convert ellipsis to three dots
      .replace(/\u2026/g, '...')
      // Remove control characters except newlines and tabs
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Normalize Unicode
      .normalize('NFC')
  );
}

/**
 * Normalizes all text (whitespace and formatting).
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  return normalizeFormatting(normalizeWhitespace(text));
}

/**
 * Splits text into sentences.
 * Uses simple heuristics for sentence boundary detection.
 * @param text - Text to split
 * @returns Array of sentences
 */
export function splitSentences(text: string): string[] {
  // Simple sentence splitting on . ! ? followed by space and capital letter
  // This is a heuristic and won't work perfectly for all cases
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z])/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences;
}

/**
 * Splits text into paragraphs.
 * @param text - Text to split
 * @returns Array of paragraphs
 */
export function splitParagraphs(text: string): string[] {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs;
}

/**
 * Splits text into lines.
 * @param text - Text to split
 * @returns Array of lines
 */
export function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Splits text into fixed-size chunks with optional overlap.
 * @param text - Text to split
 * @param chunkSize - Size of each chunk in characters
 * @param overlapSize - Overlap between chunks in characters
 * @returns Array of text chunks
 */
export function splitFixedSize(
  text: string,
  chunkSize: number = 1000,
  overlapSize: number = 100
): string[] {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be greater than 0');
  }

  if (overlapSize < 0 || overlapSize >= chunkSize) {
    throw new Error('overlapSize must be between 0 and chunkSize');
  }

  const chunks: string[] = [];
  const step = chunkSize - overlapSize;

  for (let i = 0; i < text.length; i += step) {
    const chunk = text.substring(i, i + chunkSize);
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

/**
 * Splits text into chunks while respecting sentence boundaries.
 * @param text - Text to split
 * @param targetChunkSize - Target size in characters
 * @param minChunkSize - Minimum chunk size
 * @returns Array of text chunks
 */
export function splitSemanticChunks(
  text: string,
  targetChunkSize: number = 1000,
  minChunkSize: number = 200
): string[] {
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;

    if (potentialChunk.length <= targetChunkSize) {
      currentChunk = potentialChunk;
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    }
  }

  // Add remaining chunk
  if (currentChunk.length >= minChunkSize) {
    chunks.push(currentChunk);
  }

  return chunks.filter((chunk) => chunk.length > 0);
}

/**
 * Splits text into paragraph-based chunks.
 * Each chunk contains one or more complete paragraphs.
 * @param text - Text to split
 * @param targetChunkSize - Target size in characters
 * @returns Array of text chunks
 */
export function splitParagraphChunks(
  text: string,
  targetChunkSize: number = 1000
): string[] {
  const paragraphs = splitParagraphs(text);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const potentialChunk =
      currentChunk + (currentChunk ? '\n\n' : '') + paragraph;

    if (potentialChunk.length <= targetChunkSize) {
      currentChunk = potentialChunk;
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      currentChunk = paragraph;
    }
  }

  // Add remaining chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Strips common prefixes and suffixes from text.
 * Useful for cleaning extracted text.
 * @param text - Text to strip
 * @returns Stripped text
 */
export function stripCommonPatterns(text: string): string {
  return (
    text
      // Remove page numbers (common in PDFs)
      .replace(/^\s*-?\s*\d+\s*-?\s*$/gm, '')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      // Remove email addresses
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
      .trim()
  );
}

/**
 * Removes duplicate lines from text.
 * @param text - Text to deduplicate
 * @returns Text with duplicate lines removed
 */
export function removeDuplicateLines(text: string): string {
  const lines = splitLines(text);
  const uniqueLines = Array.from(new Set(lines));
  return uniqueLines.join('\n');
}

/**
 * Calculates text statistics for a chunk.
 * @param text - Text to analyze
 * @returns Statistics object
 */
export function getTextStats(text: string) {
  return {
    characterCount: text.length,
    characterCountNoWhitespace: text.replace(/\s/g, '').length,
    wordCount: countWords(text),
    tokenCount: estimateTokenCount(text),
    sentenceCount: splitSentences(text).length,
    paragraphCount: splitParagraphs(text).length,
    lineCount: splitLines(text).length,
  };
}

/**
 * Truncates text to a maximum length.
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add if truncated (default '...')
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Extracts keywords from text (simple implementation).
 * Removes common stop words and returns frequent terms.
 * @param text - Text to extract keywords from
 * @param maxKeywords - Maximum keywords to return
 * @returns Array of keywords
 */
export function extractKeywords(
  text: string,
  maxKeywords: number = 10
): string[] {
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'up',
    'about',
    'into',
    'through',
    'during',
    'before',
    'after',
    'above',
    'below',
    'between',
    'under',
    'again',
    'further',
    'then',
    'once',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'this',
    'that',
    'these',
    'those',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
  ]);

  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  const frequency: Record<string, number> = {};
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return sorted;
}
