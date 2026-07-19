/**
 * AIAgentStatus Component
 * Shows AI agent execution status
 */

import React from 'react';
import type { AgentStatus } from '@/types/ai-workspace';
import { Card } from '@/components/ui/card';
import { Loader, CheckCircle } from 'lucide-react';

interface AIAgentStatusProps {
  status: AgentStatus;
  isCompact?: boolean;
}

export function AIAgentStatus({
  status,
  isCompact = false,
}: AIAgentStatusProps): React.ReactElement {
  if (!status.isActive && !status.agents?.some(a => a.status !== 'complete')) {
    return <div />;
  }

  if (isCompact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader className="h-4 w-4 animate-spin text-blue-500" />
        <span className="text-slate-600 dark:text-slate-400">
          {status.currentAgent || 'Processing...'}
        </span>
      </div>
    );
  }

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
      <div className="p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Agent Processing</h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-blue-700 dark:text-blue-300">Overall Progress</span>
            <span className="text-blue-700 dark:text-blue-300">{Math.round(status.progress)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        </div>

        {/* Individual Agents */}
        {status.agents && status.agents.length > 0 && (
          <div className="space-y-2">
            {status.agents.map(agent => (
              <div key={agent.name} className="flex items-center gap-2">
                {agent.status === 'complete' ? (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : agent.status === 'running' ? (
                  <Loader className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 border-2 border-slate-300 dark:border-slate-600 rounded-full flex-shrink-0" />
                )}
                <span className="text-xs text-blue-800 dark:text-blue-200 flex-1">{agent.name}</span>
                <span className="text-xs text-blue-600 dark:text-blue-300">{agent.progress}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
