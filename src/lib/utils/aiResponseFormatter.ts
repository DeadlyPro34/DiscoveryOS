/**
 * AI Response Formatter
 * Utilities for formatting and rendering AI responses with evidence
 */

import type { AIResponse } from '@/types/ai-workspace';

/**
 * Format confidence level as percentage with visual indicator
 */
export function formatConfidence(confidence: number): string {
  if (confidence >= 90) return '🟢 Very High';
  if (confidence >= 75) return '🟡 High';
  if (confidence >= 60) return '🟠 Moderate';
  return '🔴 Low';
}

/**
 * Format priority level with emoji
 */
export function formatPriority(priority: string): string {
  const priorityMap: Record<string, string> = {
    critical: '🔴 Critical',
    high: '🟠 High',
    medium: '🟡 Medium',
    low: '🔵 Low',
  };
  return priorityMap[priority] || priority;
}

/**
 * Format sentiment with emoji and label
 */
export function formatSentiment(sentiment: string): string {
  const sentimentMap: Record<string, string> = {
    positive: '😊 Positive',
    neutral: '😐 Neutral',
    negative: '😞 Negative',
    mixed: '🤔 Mixed',
  };
  return sentimentMap[sentiment] || sentiment;
}

/**
 * Format frequency level
 */
export function formatFrequency(frequency: string): string {
  const frequencyMap: Record<string, string> = {
    rare: 'Rare',
    occasional: 'Occasional',
    frequent: 'Frequent',
    universal: 'Universal',
  };
  return frequencyMap[frequency] || frequency;
}

/**
 * Format date in readable format
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

/**
 * Extract main topic from query
 */
export function extractTopicFromQuery(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('pain point') || lowerQuery.includes('problem'))
    return 'pain-point';
  if (lowerQuery.includes('feature') || lowerQuery.includes('build') || lowerQuery.includes('next'))
    return 'feature-priority';
  if (lowerQuery.includes('churn') || lowerQuery.includes('retention') || lowerQuery.includes('risk'))
    return 'retention-risks';
  if (
    lowerQuery.includes('opportunity') ||
    lowerQuery.includes('market') ||
    lowerQuery.includes('expansion')
  )
    return 'market-opportunity';
  if (lowerQuery.includes('prd') || lowerQuery.includes('requirement'))
    return 'dark-mode-prd';

  return 'pain-point';
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

/**
 * Generate summary of AI response for preview
 */
export function generateResponsePreview(response: AIResponse, maxLength: number = 100): string {
  return truncateText(response.summary, maxLength);
}

/**
 * Format business impact for display
 */
export function formatBusinessImpact(impact: string): string {
  // Extract ARR/revenue figures and format them
  const arrMatch = impact.match(/\$[\d.]+[MK]?(?:\s*ARR)?/g);
  if (arrMatch) {
    return impact.replace(/\$[\d.]+[MK]?(?:\s*ARR)?/g, match => `<strong>${match}</strong>`);
  }
  return impact;
}

/**
 * Color for sentiment badge
 */
export function getSentimentColor(sentiment: string): string {
  const colorMap: Record<string, string> = {
    positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    neutral: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    mixed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return colorMap[sentiment] || 'bg-gray-100 text-gray-800';
}

/**
 * Color for priority badge
 */
export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };
  return colorMap[priority] || 'bg-gray-100 text-gray-800';
}

/**
 * Color for confidence badge
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (confidence >= 75) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
}
