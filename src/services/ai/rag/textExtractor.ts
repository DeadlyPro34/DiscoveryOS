/**
 * Text Extractor Service
 * Handles text extraction from various document formats with encoding detection.
 */

import { ExtractionResult, ExtractionOptions } from '@/types/ai/rag';

const logger = {
  debug: (msg: string, data?: unknown) => console.debug(`[TextExtractor:DEBUG] ${msg}`, data),
  info: (msg: string, data?: unknown) => console.info(`[TextExtractor:INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[TextExtractor:WARN] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[TextExtractor:ERROR] ${msg}`, data),
};

/**
 * Default extraction options
 */
const DEFAULT_EXTRACTION_OPTIONS: ExtractionOptions = {
  supportedFormats: ['.txt', '.pdf', '.docx', '.md', '.json'],
  extractMetadata: true,
  detectEncoding: true,
  normalizeWhitespace: true,
  preserveFormatting: false,
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
};

/**
 * Text extraction service for various document formats
 */
export class TextExtractor {
  private options: ExtractionOptions;

  constructor(options?: Partial<ExtractionOptions>) {
    this.options = { ...DEFAULT_EXTRACTION_OPTIONS, ...options };
    logger.info('TextExtractor initialized', this.options);
  }

  /**
   * Extract text from a file buffer
   */
  async extract(
    filename: string,
    buffer: Buffer,
    options?: Partial<ExtractionOptions>,
  ): Promise<ExtractionResult> {
    const startTime = Date.now();
    const opts = { ...this.options, ...options };

    try {
      logger.debug('Starting text extraction', { filename, size: buffer.length });

      // Validate file size
      if (opts.maxSizeBytes && buffer.length > opts.maxSizeBytes) {
        throw new Error(
          `File size (${buffer.length} bytes) exceeds maximum (${opts.maxSizeBytes} bytes)`,
        );
      }

      // Get file extension
      const ext = this.getFileExtension(filename).toLowerCase();

      // Check if format is supported
      if (!opts.supportedFormats.includes(ext)) {
        throw new Error(`File format ${ext} is not supported`);
      }

      // Extract based on format
      let content = '';
      let metadata = {
        title: filename,
        characterCount: 0,
        wordCount: 0,
        tokenCount: 0,
        warnings: [] as string[],
      };

      switch (ext) {
        case '.txt':
        case '.md':
          const extraction = await this.extractPlainText(buffer, opts);
          content = extraction.content;
          metadata = { ...metadata, ...extraction.metadata };
          break;

        case '.pdf':
          logger.warn('PDF extraction not fully implemented, attempting text extraction');
          const pdfExtraction = await this.extractPDF(buffer, opts);
          content = pdfExtraction.content;
          metadata = { ...metadata, ...pdfExtraction.metadata };
          break;

        case '.docx':
          logger.warn('DOCX extraction not fully implemented, attempting text extraction');
          const docxExtraction = await this.extractDOCX(buffer, opts);
          content = docxExtraction.content;
          metadata = { ...metadata, ...docxExtraction.metadata };
          break;

        case '.json':
          const jsonExtraction = await this.extractJSON(buffer, opts);
          content = jsonExtraction.content;
          metadata = { ...metadata, ...jsonExtraction.metadata };
          break;

        default:
          throw new Error(`Unsupported file format: ${ext}`);
      }

      // Normalize whitespace if requested
      if (opts.normalizeWhitespace) {
        content = this.normalizeWhitespace(content);
      }

      // Calculate metrics
      const characterCount = content.length;
      const wordCount = this.calculateWordCount(content);
      const tokenCount = this.estimateTokenCount(content);

      logger.info('Text extraction completed', {
        filename,
        characterCount,
        wordCount,
        tokenCount,
        duration: Date.now() - startTime,
      });

      return {
        content,
        encoding: 'utf-8',
        metadata: {
          ...metadata,
          characterCount,
          wordCount,
          tokenCount,
        },
        success: true,
        processingTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      logger.error('Text extraction failed', error);
      return {
        content: '',
        encoding: 'unknown',
        metadata: {
          title: filename,
          characterCount: 0,
          wordCount: 0,
          tokenCount: 0,
          warnings: [error instanceof Error ? error.message : 'Unknown error'],
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Extract text from plain text files
   */
  private async extractPlainText(
    buffer: Buffer,
    options: ExtractionOptions,
  ): Promise<{ content: string; metadata: Record<string, unknown> }> {
    try {
      // Detect encoding
      const encoding = options.detectEncoding ? this.detectEncoding(buffer) : 'utf-8';
      
      const content = buffer.toString(encoding as BufferEncoding);

      return {
        content,
        metadata: {
          encoding,
          warnings: [],
        },
      };
    } catch (error) {
      logger.error('Failed to extract plain text', error);
      throw new Error(`Plain text extraction failed: ${error}`);
    }
  }

  /**
   * Extract text from PDF files (stub implementation)
   * In production, use pdfjs, pdf2json, or similar library
   */
  private async extractPDF(
    buffer: Buffer,
    options: ExtractionOptions,
  ): Promise<{ content: string; metadata: Record<string, unknown> }> {
    try {
      // This is a stub - in production, use a proper PDF library
      logger.warn('PDF extraction using basic text extraction');
      
      // Try to extract any readable text
      const text = buffer.toString('utf-8', 0, Math.min(10000, buffer.length));
      const cleanedText = text.replace(/[^\w\s.,!?-]/g, ' ');

      return {
        content: cleanedText,
        metadata: {
          format: 'pdf',
          warnings: ['PDF extraction is limited - use a PDF library for full support'],
        },
      };
    } catch (error) {
      throw new Error(`PDF extraction failed: ${error}`);
    }
  }

  /**
   * Extract text from DOCX files (stub implementation)
   * In production, use docx or similar library
   */
  private async extractDOCX(
    buffer: Buffer,
    options: ExtractionOptions,
  ): Promise<{ content: string; metadata: Record<string, unknown> }> {
    try {
      // This is a stub - in production, use a proper DOCX library
      logger.warn('DOCX extraction using basic text extraction');
      
      const text = buffer.toString('utf-8', 0, Math.min(10000, buffer.length));
      const cleanedText = text.replace(/[^\w\s.,!?-]/g, ' ');

      return {
        content: cleanedText,
        metadata: {
          format: 'docx',
          warnings: ['DOCX extraction is limited - use a DOCX library for full support'],
        },
      };
    } catch (error) {
      throw new Error(`DOCX extraction failed: ${error}`);
    }
  }

  /**
   * Extract text from JSON files
   */
  private async extractJSON(
    buffer: Buffer,
    options: ExtractionOptions,
  ): Promise<{ content: string; metadata: Record<string, unknown> }> {
    try {
      const text = buffer.toString('utf-8');
      const json = JSON.parse(text);

      // Convert JSON to readable text
      const content = this.jsonToText(json);

      return {
        content,
        metadata: {
          format: 'json',
          warnings: [],
        },
      };
    } catch (error) {
      throw new Error(`JSON extraction failed: ${error}`);
    }
  }

  /**
   * Convert JSON object to readable text
   */
  private jsonToText(obj: unknown, depth = 0): string {
    const indent = '  '.repeat(depth);
    
    if (typeof obj === 'string') {
      return obj;
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj.toString();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.jsonToText(item, depth + 1)).join('\n');
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj as Record<string, unknown>);
      return entries
        .map(([key, value]) => `${indent}${key}: ${this.jsonToText(value, depth + 1)}`)
        .join('\n');
    }
    
    return '';
  }

  /**
   * Detect file encoding
   */
  private detectEncoding(buffer: Buffer): string {
    // Check for BOM markers
    if (buffer.length >= 3) {
      if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
        return 'utf-8';
      }
    }

    if (buffer.length >= 2) {
      if (buffer[0] === 0xff && buffer[1] === 0xfe) {
        return 'utf-16le';
      }
      if (buffer[0] === 0xfe && buffer[1] === 0xff) {
        return 'utf-16be';
      }
    }

    // Default to UTF-8
    return 'utf-8';
  }

  /**
   * Get file extension
   */
  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot);
  }

  /**
   * Normalize whitespace in text
   */
  private normalizeWhitespace(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n\n+/g, '\n\n') // Remove excessive line breaks
      .replace(/[ \t]+/g, ' ') // Collapse multiple spaces/tabs
      .trim();
  }

  /**
   * Calculate word count
   */
  private calculateWordCount(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.filter(word => word.length > 0).length;
  }

  /**
   * Estimate token count using rough heuristic
   * In production, use a proper tokenizer like js-tiktoken
   */
  private estimateTokenCount(text: string): number {
    // Rough estimate: 1 token per 4 characters on average
    // This is a simplification; use a real tokenizer for accuracy
    return Math.ceil(text.length / 4);
  }
}

/**
 * Factory function to create a text extractor
 */
export function createTextExtractor(options?: Partial<ExtractionOptions>): TextExtractor {
  return new TextExtractor(options);
}
