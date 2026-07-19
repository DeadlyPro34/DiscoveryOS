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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b-[3px] border-black bg-[#FFE066]">
        <h2 className="text-xl font-black uppercase tracking-tight">Supporting Evidence</h2>
        <p className="text-sm font-bold text-black/80 mt-1">
          {evidence.quotes.length} quotes • {evidence.averageConfidence}% avg confidence
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Sentiment Breakdown */}
        <div className="p-4 border-b-[3px] border-black">
          <h3 className="text-md font-black mb-4">Sentiment Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-[#FF3838]">Negative</span>
              <span>{evidence.sentimentBreakdown.negative}%</span>
            </div>
            <div className="w-full bg-white border-[3px] border-black rounded-full h-4 overflow-hidden">
              <div
                className="bg-[#FF3838] h-full border-r-[3px] border-black"
                style={{ width: `${evidence.sentimentBreakdown.negative}%` }}
              />
            </div>

            <div className="flex justify-between text-sm font-bold">
              <span className="text-[#FF9F1C]">Neutral</span>
              <span>{evidence.sentimentBreakdown.neutral}%</span>
            </div>
            <div className="w-full bg-white border-[3px] border-black rounded-full h-4 overflow-hidden">
              <div
                className="bg-[#FF9F1C] h-full border-r-[3px] border-black"
                style={{ width: `${evidence.sentimentBreakdown.neutral}%` }}
              />
            </div>

            <div className="flex justify-between text-sm font-bold">
              <span className="text-[#2EC4B6]">Positive</span>
              <span>{evidence.sentimentBreakdown.positive}%</span>
            </div>
            <div className="w-full bg-white border-[3px] border-black rounded-full h-4 overflow-hidden">
              <div
                className="bg-[#2EC4B6] h-full border-r-[3px] border-black"
                style={{ width: `${evidence.sentimentBreakdown.positive}%` }}
              />
            </div>
          </div>
        </div>

        {/* Related Themes */}
        {evidence.relatedThemes.length > 0 && (
          <div className="p-4 border-b-[3px] border-black">
            <h3 className="text-md font-black mb-3">Related Themes</h3>
            <div className="flex flex-wrap gap-2">
              {evidence.relatedThemes.map(theme => (
                <span
                  key={theme}
                  className="px-3 py-1 text-xs font-bold border-[3px] border-black rounded-xl bg-[#FF90E8] shadow-neo"
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
            <h3 className="text-md font-black mb-3">Affected Personas</h3>
            <div className="flex flex-wrap gap-2">
              {evidence.relatedPersonas.map(persona => (
                <span
                  key={persona}
                  className="px-3 py-1 text-xs font-bold border-[3px] border-black rounded-xl bg-[#38DBFF] shadow-neo"
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
