/**
 * Document processor service for DiscoveryOS.
 * Handles document normalization, parsing, and metadata extraction.
 */

import { DocumentMetadata } from '../../types/ai';
import {
  estimateTokenCount,
  countWords,
  estimateReadingTime,
} from '../../lib/utils/ai/tokenizer';

export interface IDocumentProcessor {
  parse(content: string, filename: string, mimeType: string): Promise<string>;
  normalize(content: string): Promise<string>;
  detectLanguage(content: string): Promise<string>;
  extractMetadata(
    content: string,
    filename: string,
    fileSize: number,
    mimeType: string
  ): Promise<DocumentMetadata>;
}

/**
 * Document processor service implementation.
 * Provides text normalization, parsing, and metadata extraction.
 */
export class DocumentProcessor implements IDocumentProcessor {
  /**
   * Parses document content based on MIME type.
   * Currently handles plain text extraction (full implementations would handle PDF, DOCX, etc.)
   */
  async parse(
    content: string,
    filename: string,
    mimeType: string
  ): Promise<string> {
    // For now, assume content is already extracted from upload pipeline
    // In production, this would parse PDF, DOCX, etc.
    return content;
  }

  /**
   * Normalizes document text.
   * Removes extra whitespace, standardizes line breaks, etc.
   */
  async normalize(content: string): Promise<string> {
    return (
      content
        // Remove multiple spaces
        .replace(/  +/g, ' ')
        // Remove multiple line breaks
        .replace(/\n\n\n+/g, '\n\n')
        // Remove trailing/leading whitespace
        .trim()
    );
  }

  /**
   * Detects language of document content.
   * Mock implementation returns English; production would use language detection.
   */
  async detectLanguage(content: string): Promise<string> {
    // Mock implementation - in production use language-detect library
    // Check for common non-English patterns
    if (content.match(/[\u0600-\u06FF]/)) return 'ar'; // Arabic
    if (content.match(/[\u4E00-\u9FFF]/)) return 'zh'; // Chinese
    if (content.match(/[\u3040-\u309F]/)) return 'ja'; // Japanese
    if (content.match(/[\uAC00-\uD7AF]/)) return 'ko'; // Korean
    if (content.match(/[\u0401\u0451\u0410-\u044F]/)) return 'ru'; // Russian
    return 'en'; // Default to English
  }

  /**
   * Extracts metadata from document.
   * @param content - Document content
   * @param filename - Original filename
   * @param fileSize - File size in bytes
   * @param mimeType - MIME type
   */
  async extractMetadata(
    content: string,
    filename: string,
    fileSize: number,
    mimeType: string
  ): Promise<DocumentMetadata> {
    const language = await this.detectLanguage(content);
    const wordCount = countWords(content);
    const tokenCount = estimateTokenCount(content);
    const characterCount = content.length;
    const readingTimeMinutes = estimateReadingTime(content);

    // Try to extract title from filename or first line
    let title: string | undefined;
    if (filename) {
      title = filename.replace(/\.[^.]*$/, '').trim();
    }

    return {
      filename,
      mimeType,
      fileSize,
      language,
      characterCount,
      wordCount,
      tokenCount,
      readingTimeMinutes,
      title,
      createdAt: new Date(),
      extractedAt: new Date(),
      warnings: [],
    };
  }
}

// Export singleton instance
export const documentProcessor = new DocumentProcessor();
