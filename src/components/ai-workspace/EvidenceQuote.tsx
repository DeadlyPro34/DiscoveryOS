/**
 * EvidenceQuote Component
 * Display a single customer quote with metadata
 */

import React from 'react';
import type { EvidenceQuote } from '@/types/ai-workspace';
import { formatDate, formatSentiment, getSentimentColor } from '@/lib/utils/aiResponseFormatter';

interface EvidenceQuoteProps {
  quote: EvidenceQuote;
  onClick?: () => void;
  highlight?: boolean;
}

export function EvidenceQuote({ quote, onClick, highlight }: EvidenceQuoteProps): React.ReactElement {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border transition-all cursor-pointer ${
        highlight
          ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
          : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-700'
      }`}
    >
      {/* Quote Text */}
      <p className="text-sm leading-relaxed mb-2 text-slate-700 dark:text-slate-300">"{quote.quote}"</p>

      {/* Metadata Row */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex gap-2 items-center">
          <span className="font-medium text-slate-900 dark:text-slate-200">{quote.customerName}</span>
          <span className={`px-2 py-0.5 rounded-full ${getSentimentColor(quote.sentiment)}`}>
            {formatSentiment(quote.sentiment)}
          </span>
        </div>

        <div className="flex gap-2 text-slate-500 dark:text-slate-400">
          <span>{quote.source}</span>
          <span>•</span>
          <span>{formatDate(quote.date)}</span>
        </div>
      </div>

      {/* Confidence + Theme/Persona */}
      {(quote.theme || quote.persona) && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {quote.theme && (
            <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {quote.theme}
            </span>
          )}
          {quote.persona && (
            <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              {quote.persona}
            </span>
          )}
          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {quote.confidence}% confidence
          </span>
        </div>
      )}
    </div>
  );
}
