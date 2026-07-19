/**
 * Opportunity Card Component
 * Displays a product opportunity with metrics and action buttons
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Eye,
  FileText,
  Map,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { OpportunityCard as OpportunityCardType } from '@/types/executive';
import { cn } from '@/lib/utils/cn';

interface OpportunityCardProps {
  opportunity: OpportunityCardType;
  onViewEvidence?: (id: string) => void;
  onGeneratePRD?: (id: string) => void;
  onAddToRoadmap?: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function OpportunityCard({
  opportunity,
  onViewEvidence,
  onGeneratePRD,
  onAddToRoadmap,
}: OpportunityCardProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  const priorityColor = priorityColors[opportunity.priority] || priorityColors.medium;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{opportunity.title}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {opportunity.description}
            </p>
          </div>
          <Badge className={priorityColor}>{opportunity.priority}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Opportunity Score
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {opportunity.opportunityScore}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                RICE Score
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {opportunity.riceScore}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Confidence
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {opportunity.confidence}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Evidence
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {opportunity.evidenceCount}
              </p>
            </div>
          </div>

          {/* Expandable Details */}
          {expanded && (
            <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Primary Persona
                </p>
                <p className="text-sm">{opportunity.primaryPersona}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Related Themes
                </p>
                <div className="flex flex-wrap gap-1">
                  {opportunity.relatedThemes.map((theme) => (
                    <Badge key={theme} variant="outline" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  What Customers Are Saying
                </p>
                <ul className="space-y-1 text-sm">
                  {opportunity.customersSaying.map((quote, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300 pl-3 border-l-2 border-blue-500">
                      &quot;{quote}&quot;
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Recommendation
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  {opportunity.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="flex-1 md:flex-none"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Details
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewEvidence?.(opportunity.id)}
              className="flex-1 md:flex-none"
            >
              <Eye className="h-4 w-4 mr-1" />
              Evidence
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => onGeneratePRD?.(opportunity.id)}
              className="flex-1 md:flex-none"
            >
              <FileText className="h-4 w-4 mr-1" />
              PRD
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => onAddToRoadmap?.(opportunity.id)}
              className="flex-1 md:flex-none"
            >
              <Map className="h-4 w-4 mr-1" />
              Roadmap
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
