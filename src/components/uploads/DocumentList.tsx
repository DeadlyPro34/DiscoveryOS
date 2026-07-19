'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Trash2, Eye } from 'lucide-react';
import { Document } from '@/types/uploads';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DocumentCard } from './DocumentCard';
import { DocumentEmptyState } from './DocumentEmptyState';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface DocumentListProps {
  documents: Document[];
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

export function DocumentList({
  documents,
  onRetry,
  onDelete,
  onView,
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([
    'Waiting',
    'Uploading',
    'Uploaded',
    'Processing',
    'Completed',
    'Failed',
  ]);
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');

  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        statusFilter.includes(doc.status)
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return (
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
          );
      }
    });

    return filtered;
  }, [documents, searchQuery, statusFilter, sortBy]);

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  if (documents.length === 0) {
    return <DocumentEmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-[10px]">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 h-[38px] bg-[#fff] border-[1.5px] border-[#d0d0d0] rounded-[8px] outline-none focus:border-[#111] focus:ring-0 transition-colors text-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-[38px] bg-[#fff] border-[1.5px] border-[#d0d0d0] rounded-[8px] px-3 text-sm font-medium hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Status
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {['Waiting', 'Uploading', 'Uploaded', 'Processing', 'Completed', 'Failed'].map(
              (status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={() => toggleStatusFilter(status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center h-[38px] bg-[#fff] border-[1.5px] border-[#d0d0d0] rounded-[8px] px-3 text-sm font-medium hover:bg-gray-50 transition-colors">
              Sort: {sortBy === 'date' ? 'Date' : sortBy === 'size' ? 'Size' : 'Name'}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('date')}>
              Date (Newest)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('size')}>
              Size (Largest)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name')}>
              Name (A-Z)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No documents found matching your filters
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </p>
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onRetry={onRetry}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
