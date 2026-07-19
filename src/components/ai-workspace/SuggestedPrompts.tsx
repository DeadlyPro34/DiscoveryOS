/**
 * SuggestedPrompts Component
 * Quick action prompts for users
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export function SuggestedPrompts({
  prompts,
  onPromptClick,
}: SuggestedPromptsProps): React.ReactElement {
  return (
    <div className="px-4 py-6 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-medium">Suggested Questions</h3>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto py-2 px-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={() => onPromptClick(prompt)}
          >
            <span className="text-xs">{prompt}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
