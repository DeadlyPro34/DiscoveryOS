/**
 * EvidencePanel Component
 * Right sidebar showing supporting evidence and data
 */

import React from 'react';
import type { EvidencePanelData } from '@/types/ai-workspace';
import { EvidenceQuote } from './EvidenceQuote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EvidencePanelProps {
  evidence: EvidencePanelData;
  onQuoteClick?: (quoteId: string) => void;
  isLoading?: boolean;
}

export function EvidencePanel({
  evidence,
  onQuoteClick,
  isLoading = false,
}: EvidencePanelProps): React.ReactElement {
  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold">Supporting Evidence</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {evidence.quotes.length} quotes • {evidence.averageConfidence}% avg confidence
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Sentiment Breakdown */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium mb-3">Sentiment Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-red-700 dark:text-red-300">Negative</span>
              <span className="font-medium">{evidence.sentimentBreakdown.negative}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-500 h-full"
                style={{ width: `${evidence.sentimentBreakdown.negative}%` }}
              />
            </div>

            <div className="flex justify-between text-xs mt-3">
              <span className="text-yellow-700 dark:text-yellow-300">Neutral</span>
              <span className="font-medium">{evidence.sentimentBreakdown.neutral}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-500 h-full"
                style={{ width: `${evidence.sentimentBreakdown.neutral}%` }}
              />
            </div>

            <div className="flex justify-between text-xs mt-3">
              <span className="text-green-700 dark:text-green-300">Positive</span>
              <span className="font-medium">{evidence.sentimentBreakdown.positive}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${evidence.sentimentBreakdown.positive}%` }}
              />
            </div>
          </div>
        </div>

        {/* Related Themes */}
        {evidence.relatedThemes.length > 0 && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium mb-2">Related Themes</h3>
            <div className="flex flex-wrap gap-2">
              {evidence.relatedThemes.map(theme => (
                <span
                  key={theme}
                  className="px-2.5 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Personas */}
        {evidence.relatedPersonas.length > 0 && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium mb-2">Affected Personas</h3>
            <div className="flex flex-wrap gap-2">
              {evidence.relatedPersonas.map(persona => (
                <span
                  key={persona}
                  className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                >
                  {persona}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quotes */}
        <div className="p-4">
          <h3 className="text-sm font-medium mb-3">Customer Quotes</h3>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                <p>Loading evidence...</p>
              </div>
            ) : evidence.quotes.length > 0 ? (
              evidence.quotes.map(quote => (
                <EvidenceQuote
                  key={quote.id}
                  quote={quote}
                  onClick={() => onQuoteClick?.(quote.id)}
                />
              ))
            ) : (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                <p className="text-sm">No supporting evidence available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
