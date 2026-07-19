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
    <div className="flex items-center gap-[10px] px-[28px] pb-[16px]">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search projects..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-9 h-[38px] bg-[#fff] border-[3px] border-black rounded-[8px] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] transition-all text-sm font-bold placeholder:font-normal"
          />
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-[38px] bg-[#fff] border-[3px] border-black rounded-[8px] px-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all">
              Status {status && `(${status})`}
            </button>
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
            <button className="h-[38px] bg-[#fff] border-[3px] border-black rounded-[8px] px-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all">
              Sort: {sortBy === 'date' ? 'Latest' : sortBy === 'name' ? 'Name' : sortBy === 'insights' ? 'Insights' : 'Uploads'}
            </button>
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

        <div className="flex items-center gap-1 border-[3px] border-black rounded-[8px] p-1 bg-[#fff] h-[38px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => onLayoutChange('grid')}
            className={`h-7 w-7 p-0 flex items-center justify-center rounded-[4px] ${layoutType === 'grid' ? 'bg-[#FFE066] border-black border-2' : 'hover:bg-gray-100'}`}
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onLayoutChange('list')}
            className={`h-7 w-7 p-0 flex items-center justify-center rounded-[4px] ${layoutType === 'list' ? 'bg-[#FFE066] border-black border-2' : 'hover:bg-gray-100'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {onCreateProject && (
          <button 
            onClick={onCreateProject} 
            className="h-[38px] bg-[#38DBFF] text-black border-[3px] border-black rounded-[8px] px-4 flex items-center gap-2 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </button>
        )}
      </div>
    </div>
  );
};
