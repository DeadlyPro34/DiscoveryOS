/**
 * Insight Timeline Item Component
 * Displays a single insight in the timeline
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Zap,
  AlertCircle,
} from 'lucide-react';
import type { ExecutiveInsight } from '@/types/executive';
import { cn } from '@/lib/utils/cn';

interface InsightTimelineItemProps {
  insight: ExecutiveInsight;
}

const typeIcons: Record<string, React.FC<{ className?: string }>> = {
  pain_point: AlertTriangle,
  feature_request: Zap,
  trend: TrendingUp,
  opportunity: Lightbulb,
  risk: AlertCircle,
};

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  pain_point: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
  },
  feature_request: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
  },
  trend: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
  },
  opportunity: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
  },
  risk: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-900 dark:text-orange-100',
  },
};

const sentimentColors: Record<string, string> = {
  positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  mixed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function InsightTimelineItem({
  insight,
}: InsightTimelineItemProps): React.ReactElement {
  const colors = typeColors[insight.type] || typeColors.trend;
  const Icon = typeIcons[insight.type];

  const formattedTime = insight.timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex gap-4">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0',
            colors.border,
            colors.bg
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-1 flex-grow mt-2 mb-2 bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {insight.title}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedTime}
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          {insight.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={sentimentColors[insight.sentiment]}>
            {insight.sentiment}
          </Badge>
          <Badge className={priorityColors[insight.priority]}>
            {insight.priority}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {insight.evidenceCount} evidence
          </Badge>
          <Badge variant="outline" className="text-xs">
            {insight.theme}
          </Badge>
        </div>

        {insight.relatedPersonas.length > 0 && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Personas:</span>{' '}
            {insight.relatedPersonas.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
