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
      className={`p-4 rounded-xl border-[3px] border-black transition-all cursor-pointer shadow-neo ${
        highlight
          ? 'bg-[#FFE066] translate-y-1 shadow-none'
          : 'bg-white hover:-translate-y-1'
      }`}
    >
      {/* Quote Text */}
      <p className="text-sm font-bold leading-relaxed mb-3 text-black">&quot;{quote.quote}&quot;</p>

      {/* Metadata Row */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex gap-2 items-center">
          <span className="font-black text-black">{quote.customerName}</span>
          <span className="px-2 py-0.5 rounded-full border-[2px] border-black font-bold bg-[#38DBFF] text-black">
            {formatSentiment(quote.sentiment)}
          </span>
        </div>

        <div className="flex gap-2 font-bold text-black/60">
          <span>{quote.source}</span>
          <span>•</span>
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Confidence + Theme/Persona */}
      {(quote.theme || quote.persona) && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {quote.theme && (
            <span className="px-2 py-1 text-xs font-bold border-[2px] border-black rounded-lg bg-[#FF90E8] text-black">
              {quote.theme}
            </span>
          )}
          {quote.persona && (
            <span className="px-2 py-1 text-xs font-bold border-[2px] border-black rounded-lg bg-[#FF9F1C] text-black">
              {quote.persona}
            </span>
          )}
          <span className="px-2 py-1 text-xs font-bold border-[2px] border-black rounded-lg bg-[#2EC4B6] text-black">
            {quote.confidence}% confidence
          </span>
        </div>
      )}
    </div>
  );
}
