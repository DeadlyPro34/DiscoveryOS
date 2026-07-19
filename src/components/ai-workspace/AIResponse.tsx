/**
 * AIResponse Component
 * Structured AI response with evidence backing
 */

import React from 'react';
import type { AIResponse } from '@/types/ai-workspace';
import {
  formatConfidence,
  formatPriority,
  getPriorityColor,
  getConfidenceColor,
} from '@/lib/utils/aiResponseFormatter';
import { FollowUpQuestions } from './FollowUpQuestions';
import { Badge } from '@/components/ui/badge';

interface AIResponseProps {
  response: AIResponse;
  onFollowUpClick?: (question: string) => void;
  isLoading?: boolean;
  streamingText?: string;
}

export function AIResponse({
  response,
  onFollowUpClick,
  isLoading = false,
  streamingText,
}: AIResponseProps): React.ReactElement {
  const content = streamingText || response.summary;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-lg border border-blue-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Summary</h3>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{content}</p>
      </div>

      {/* Key Findings */}
      {response.keyFindings.length > 0 && !streamingText && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Key Findings</h3>
          <ul className="space-y-2">
            {response.keyFindings.map((finding, index) => (
              <li key={index} className="flex gap-2 text-sm">
                <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
                <span className="text-slate-700 dark:text-slate-300">{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metadata Row */}
      {!streamingText && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className={`${getConfidenceColor(response.confidence)}`}
          >
            {formatConfidence(response.confidence)}
          </Badge>
          <Badge className={`${getPriorityColor(response.priority)}`}>
            {formatPriority(response.priority)}
          </Badge>
        </div>
      )}

      {/* Affected Personas */}
      {response.affectedPersonas.length > 0 && !streamingText && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm">
            Affected Personas
          </h3>
          <div className="flex flex-wrap gap-2">
            {response.affectedPersonas.map(persona => (
              <Badge
                key={persona.id}
                variant="outline"
                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
              >
                {persona.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related Themes */}
      {response.relatedThemes.length > 0 && !streamingText && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm">
            Related Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {response.relatedThemes.map(theme => (
              <Badge
                key={theme.id}
                variant="outline"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700"
              >
                {theme.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Business Impact */}
      {response.businessImpact && !streamingText && (
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">
            Business Impact
          </h4>
          <p className="text-sm text-green-800 dark:text-green-200">{response.businessImpact}</p>
        </div>
      )}

      {/* Recommendation */}
      {response.recommendation && !streamingText && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-1">
            Recommendation
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-200">{response.recommendation}</p>
        </div>
      )}

      {/* Follow-up Questions */}
      {!streamingText && (
        <FollowUpQuestions
          questions={response.suggestedFollowUps}
          onQuestionClick={onFollowUpClick || (() => {})}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
