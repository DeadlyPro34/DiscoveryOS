/**
 * EvidenceQuoteCard Component
 * Display a single customer quote with metadata
 */

import React from 'react';
import type { EvidenceQuote } from '@/types/ai-workspace';
import { formatSentiment } from '@/lib/utils/aiResponseFormatter';

interface EvidenceQuoteCardProps {
  quote: EvidenceQuote;
  onClick?: () => void;
  highlight?: boolean;
}

export function EvidenceQuoteCard({ quote, onClick, highlight }: EvidenceQuoteCardProps): React.ReactElement {
  // Handle date being either a Date object or ISO string
  const dateObj = quote.date instanceof Date ? quote.date : new Date(quote.date);
  const dateStr = isNaN(dateObj.getTime()) ? 'Unknown' : dateObj.toLocaleDateString();

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-[3px] border-black transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] ${
        highlight
          ? 'bg-[#FFE066]'
          : 'bg-white'
      }`}
    >
      {/* Quote Text */}
      <p className="text-sm leading-relaxed mb-3 text-[#111] italic">&quot;{quote.quote}&quot;</p>

      {/* Metadata Row */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex gap-2 items-center">
          <span className="font-[600] text-[#111]">{quote.customerName}</span>
          <span className="px-2 py-0.5 rounded-[6px] font-medium bg-gray-100 text-gray-700">
            {formatSentiment(quote.sentiment)}
          </span>
        </div>

        <div className="flex gap-2 font-medium text-[#777]">
          <span>{quote.source}</span>
          <span>•</span>
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Confidence + Theme/Persona */}
      {(quote.theme || quote.persona) && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {quote.theme && (
            <span className="px-2 py-1 text-[11px] font-bold border-[2px] border-black rounded-md bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black">
              {quote.theme}
            </span>
          )}
          {quote.persona && (
            <span className="px-2 py-1 text-[11px] font-bold border-[2px] border-black rounded-md bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black">
              {quote.persona}
            </span>
          )}
          <span className="px-2 py-1 text-[11px] font-bold border-[2px] border-black rounded-md bg-[#38DBFF] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black">
            {quote.confidence}% confidence
          </span>
        </div>
      )}
    </div>
  );
}
