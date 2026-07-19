/**
 * Collector Agent Implementation.
 * Normalizes and prepares context from raw documents.
 * Performs document cleaning, metadata extraction, and quality assessment.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

/**
 * Zod schema for Collector Agent input validation.
 */
const CollectorInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z
    .object({
      chunks: z.array(
        z.object({
          id: z.string(),
          content: z.string(),
          similarity: z.number(),
        }),
      ),
      totalMatches: z.number(),
    })
    .optional(),
  parameters: z
    .object({
      documentType: z
        .enum(['transcript', 'feedback', 'survey', 'review', 'generic'])
        .optional(),
      language: z.string().optional(),
      removeMetadata: z.boolean().optional(),
    })
    .optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Zod schema for Collector Agent output validation.
 */
const CollectorOutputSchema = z.object({
  normalized_text: z.string(),
  metadata: z.record(z.unknown()),
  entities: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
      confidence: z.number(),
    }),
  ),
  sensitive_data: z.array(z.string()),
  quality_score: z.number().min(0).max(1),
  issues: z.array(z.string()),
});

/**
 * Collector Agent: Normalizes and prepares context from raw documents.
 */
export class CollectorAgent extends BaseAgent {
  id = 'collector-agent';
  name = 'Collector Agent';
  description =
    'Normalizes and prepares context from raw documents. Performs cleaning, metadata extraction, and quality assessment.';
  category: AgentCategory = 'data-collection';
  icon = '📋';
  version = '1.0.0';

  inputSchema = CollectorInputSchema;
  outputSchema = CollectorOutputSchema;

  /**
   * Execute collector agent logic.
   * Normalizes document, extracts metadata, and assesses quality.
   */
  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const documentType =
      (input.parameters?.documentType as string) || 'generic';
    const language = (input.parameters?.language as string) || 'en';

    // Normalize text
    const normalized_text = this.normalizeText(input.content);

    // Extract entities
    const entities = this.extractEntities(normalized_text);

    // Detect sensitive data
    const sensitive_data = this.detectSensitiveData(normalized_text);

    // Extract metadata
    const metadata = this.extractMetadata(
      normalized_text,
      documentType,
      language,
    );

    // Identify issues
    const issues = this.identifyIssues(normalized_text);

    // Calculate quality score
    const quality_score = this.calculateQualityScore(
      normalized_text,
      entities,
      issues,
    );

    const structured = {
      normalized_text,
      metadata,
      entities,
      sensitive_data,
      quality_score,
      issues,
      documentType,
      language,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Normalize text: remove artifacts, clean formatting.
   */
  private normalizeText(text: string): string {
    let normalized = text;

    // Remove extra whitespace
    normalized = normalized.replace(/\s+/g, ' ');

    // Remove common formatting artifacts
    normalized = normalized.replace(/\n{3,}/g, '\n\n');
    normalized = normalized.replace(/[\t\r]/g, ' ');

    // Remove special characters that are likely artifacts
    normalized = normalized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Standardize quotes
    normalized = normalized.replace(/["']/g, '"');

    return normalized.trim();
  }

  /**
   * Extract named entities: names, emails, dates, organizations.
   */
  private extractEntities(
    text: string,
  ): Array<{ type: string; value: string; confidence: number }> {
    const entities: Array<{
      type: string;
      value: string;
      confidence: number;
    }> = [];

    // Email pattern
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
    const emails = text.match(emailPattern) || [];
    emails.forEach((email) => {
      entities.push({
        type: 'EMAIL',
        value: email,
        confidence: 0.95,
      });
    });

    // Date patterns (simple)
    const datePattern =
      /\b(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[12])[/-](\d{4}|\d{2})\b/g;
    const dates = text.match(datePattern) || [];
    dates.forEach((date) => {
      entities.push({
        type: 'DATE',
        value: date,
        confidence: 0.85,
      });
    });

    // Phone numbers (simple US pattern)
    const phonePattern = /\b(\d{3}[-.]?\d{3}[-.]?\d{4})\b/g;
    const phones = text.match(phonePattern) || [];
    phones.forEach((phone) => {
      entities.push({
        type: 'PHONE',
        value: phone,
        confidence: 0.75,
      });
    });

    // URLs
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = text.match(urlPattern) || [];
    urls.forEach((url) => {
      entities.push({
        type: 'URL',
        value: url,
        confidence: 0.9,
      });
    });

    // Capitalized phrases (potential names/organizations)
    const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const names = text.match(namePattern) || [];
    // Take only first occurrence of each unique name
    const uniqueNames = Array.from(new Set(names)).slice(0, 10);
    uniqueNames.forEach((name) => {
      entities.push({
        type: 'NAMED_ENTITY',
        value: name,
        confidence: 0.6,
      });
    });

    return entities;
  }

  /**
   * Detect sensitive data: SSN, credit cards, API keys, passwords.
   */
  private detectSensitiveData(text: string): string[] {
    const sensitiveData: string[] = [];

    // SSN pattern
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
      sensitiveData.push('potential_ssn');
    }

    // Credit card pattern
    if (/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(text)) {
      sensitiveData.push('potential_credit_card');
    }

    // API key-like patterns
    if (/api[_-]?key|token|secret|password|auth/i.test(text)) {
      sensitiveData.push('potential_api_credential');
    }

    // PII keywords
    if (/social\s+security|drivers?\s+license|passport/i.test(text)) {
      sensitiveData.push('potential_personal_id');
    }

    return sensitiveData;
  }

  /**
   * Extract metadata: document type, language, entities count, etc.
   */
  private extractMetadata(
    text: string,
    documentType: string,
    language: string,
  ): Record<string, unknown> {
    return {
      documentType,
      language,
      characterCount: text.length,
      wordCount: text.split(/\s+/).length,
      sentenceCount: text.split(/[.!?]+/).length,
      paragraphCount: text.split(/\n\n+/).length,
      extractedAt: new Date().toISOString(),
    };
  }

  /**
   * Identify issues: truncation, encoding problems, missing data.
   */
  private identifyIssues(text: string): string[] {
    const issues: string[] = [];

    // Check for very short content
    if (text.length < 50) {
      issues.push('content_too_short');
    }

    // Check for encoding issues
    if (/[\ufffd]/.test(text)) {
      issues.push('possible_encoding_error');
    }

    // Check for truncation patterns
    if (text.endsWith('...') || text.endsWith('…')) {
      issues.push('possible_truncation');
    }

    // Check for very long words (possible OCR errors)
    const words = text.split(/\s+/);
    if (words.some((w) => w.length > 50)) {
      issues.push('unusually_long_words');
    }

    // Check for duplicate characters (noise)
    if (/(.)\1{10,}/.test(text)) {
      issues.push('repeated_characters');
    }

    return issues;
  }

  /**
   * Calculate quality score based on content analysis.
   */
  private calculateQualityScore(
    text: string,
    entities: Array<{ type: string; value: string; confidence: number }>,
    issues: string[],
  ): number {
    let score = 0.7; // Base score

    // Adjust for content length
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 100) score += 0.15;
    if (wordCount < 20) score -= 0.2;

    // Adjust for entities found
    if (entities.length > 5) score += 0.1;
    if (entities.length === 0) score -= 0.05;

    // Penalize for issues
    score -= issues.length * 0.05;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Compute confidence based on content quality.
   */
  async computeConfidence(input: AgentInput): Promise<number> {
    let confidence = 0.6; // Base confidence

    // Check content length
    if (input.content.length > 500) confidence += 0.2;
    else if (input.content.length > 100) confidence += 0.1;

    // Check for context
    if (input.context?.chunks && input.context.chunks.length > 0) {
      confidence += 0.15;
    }

    // Check for metadata
    if (input.parameters?.documentType || input.parameters?.language) {
      confidence += 0.05;
    }

    return Math.min(confidence, 1.0);
  }
}

/**
 * Export collector agent singleton.
 */
export const collectorAgent = new CollectorAgent();
