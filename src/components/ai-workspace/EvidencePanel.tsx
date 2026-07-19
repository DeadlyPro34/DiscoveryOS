/**
 * EvidencePanel Component
 * Right sidebar showing supporting evidence and data
 */

import React from 'react';
import type { EvidencePanelData } from '@/types/ai-workspace';
import { EvidenceQuoteCard } from './EvidenceQuote';
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
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="p-4 border-b-[3px] border-black bg-transparent">
        <h2 className="text-lg font-[700] text-[#111]">Supporting Evidence</h2>
        <p className="text-sm text-[#777] mt-1">
          {evidence.quotes.length} quotes • {evidence.averageConfidence}% avg confidence
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" data-lenis-prevent>
        {/* Sentiment Breakdown */}
        <div className="p-4 border-b-[3px] border-black">
          <h3 className="text-md font-black text-black mb-4">Sentiment Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-red-500">Negative</span>
              <span>{evidence.sentimentBreakdown.negative}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-500 h-full"
                style={{ width: `${evidence.sentimentBreakdown.negative}%` }}
              />
            </div>

            <div className="flex justify-between text-sm font-medium">
              <span className="text-amber-500">Neutral</span>
              <span>{evidence.sentimentBreakdown.neutral}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${evidence.sentimentBreakdown.neutral}%` }}
              />
            </div>

            <div className="flex justify-between text-sm font-medium">
              <span className="text-emerald-500">Positive</span>
              <span>{evidence.sentimentBreakdown.positive}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${evidence.sentimentBreakdown.positive}%` }}
              />
            </div>
          </div>
        </div>

        {/* Related Themes */}
        {evidence.relatedThemes.length > 0 && (
          <div className="p-4 border-b-[3px] border-black">
            <h3 className="text-md font-black text-black mb-3">Related Themes</h3>
            <div className="flex flex-wrap gap-2">
              {evidence.relatedThemes.map(theme => (
                <span
                  key={theme}
                  className="px-3 py-1 text-xs font-bold border-[3px] border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Personas */}
        {evidence.relatedPersonas.length > 0 && (
          <div className="p-4 border-b-[3px] border-black">
            <h3 className="text-md font-black text-black mb-3">Affected Personas</h3>
            <div className="flex flex-wrap gap-2">
              {evidence.relatedPersonas.map(persona => (
                <span
                  key={persona}
                  className="px-3 py-1 text-xs font-bold border-[3px] border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black"
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
                <EvidenceQuoteCard
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
