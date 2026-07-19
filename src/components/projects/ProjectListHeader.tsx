'use client';

import React from 'react';
import { Search, Grid3x3, List, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ProjectListHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortBy: 'name' | 'date' | 'insights' | 'uploads';
  onSortChange: (sortBy: 'name' | 'date' | 'insights' | 'uploads') => void;
  status?: string;
  onStatusChange: (status: string | undefined) => void;
  layoutType: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  onCreateProject?: () => void;
}

export const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  status,
  onStatusChange,
  layoutType,
  onLayoutChange,
  onCreateProject,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Status {status && `(${status})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(undefined)}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('Research')}>
              Research
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('Processing')}>
              Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('Completed')}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('Archived')}>
              Archived
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort: {sortBy === 'date' ? 'Latest' : sortBy === 'name' ? 'Name' : sortBy === 'insights' ? 'Insights' : 'Uploads'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortChange('date')}>
              Latest Updated
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('name')}>
              Name (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('insights')}>
              Most Insights
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('uploads')}>
              Most Uploads
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-1 border border-slate-200 rounded-md p-1 dark:border-slate-800">
          <Button
            variant={layoutType === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onLayoutChange('grid')}
            className="h-7 w-7 p-0"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={layoutType === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onLayoutChange('list')}
            className="h-7 w-7 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {onCreateProject && (
          <Button size="sm" onClick={onCreateProject} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        )}
      </div>
    </div>
  );
};
