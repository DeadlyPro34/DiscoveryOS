/**
 * KPI Card Component
 * Displays a single KPI with trend indicator and sparkline
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPIData } from '@/types/executive';
import { cn } from '@/lib/utils/cn';

interface KPICardProps {
  kpi: KPIData;
}

const colorMap: Record<string, { bg: string; text: string; accent: string }> =
  {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      text: 'text-blue-900 dark:text-blue-100',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950',
      text: 'text-green-900 dark:text-green-100',
      accent: 'text-green-600 dark:text-green-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950',
      text: 'text-purple-900 dark:text-purple-100',
      accent: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-950',
      text: 'text-orange-900 dark:text-orange-100',
      accent: 'text-orange-600 dark:text-orange-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950',
      text: 'text-red-900 dark:text-red-100',
      accent: 'text-red-600 dark:text-red-400',
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-950',
      text: 'text-pink-900 dark:text-pink-100',
      accent: 'text-pink-600 dark:text-pink-400',
    },
  };

export function KPICard({ kpi }: KPICardProps): React.ReactElement {
  const colors = colorMap[kpi.color] || colorMap.blue;
  const TrendIcon =
    kpi.trend === 'up'
      ? TrendingUp
      : kpi.trend === 'down'
        ? TrendingDown
        : Minus;

  const trendColor =
    kpi.trend === 'up'
      ? 'text-green-600 dark:text-green-400'
      : kpi.trend === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-600 dark:text-gray-400';

  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn('pb-3', colors.bg)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={cn('text-sm font-medium', colors.text)}>
              {kpi.title}
            </CardTitle>
          </div>
          <div className={cn('text-2xl', colors.accent)}>📊</div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <div className={cn('text-3xl font-bold', colors.accent)}>
              {kpi.formattedValue}
            </div>
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium mt-2',
                trendColor
              )}
            >
              <TrendIcon className="h-4 w-4" />
              <span>
                {Math.abs(kpi.trendPercentage)}%{' '}
                {kpi.trend === 'up'
                  ? 'increase'
                  : kpi.trend === 'down'
                    ? 'decrease'
                    : 'stable'}{' '}
                vs last month
              </span>
            </div>
          </div>

          {/* Simple sparkline placeholder */}
          <div className="h-12 bg-gray-50 dark:bg-gray-800 rounded flex items-end justify-between px-2 gap-1">
            {[65, 45, 78, 55, 88, 72, 95].map((height, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 rounded-sm opacity-70',
                  colors.accent.replace('text-', 'bg-')
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
