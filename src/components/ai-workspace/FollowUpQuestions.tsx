/**
 * FollowUpQuestions Component
 * 3 suggested next questions
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FollowUpQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isLoading?: boolean;
}

export function FollowUpQuestions({
  questions,
  onQuestionClick,
  isLoading = false,
}: FollowUpQuestionsProps): React.ReactElement {
  if (questions.length === 0) return <div />;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
        Suggested Follow-ups
      </p>

      <div className="space-y-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-between w-full text-left h-auto py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => onQuestionClick(question)}
            disabled={isLoading}
          >
            <span className="text-xs flex-1">{question}</span>
            <ArrowRight className="h-3 w-3 ml-2 flex-shrink-0" />
          </Button>
        ))}
      </div>
    </div>
  );
}
