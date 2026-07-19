'use client';

import { useState, useCallback } from 'react';

interface ProjectFilters {
  status?: string;
  sortBy: 'name' | 'date' | 'insights' | 'uploads';
  query: string;
  layoutType: 'grid' | 'list';
}

export const useProjectFilters = () => {
  const [filters, setFilters] = useState<ProjectFilters>({
    status: undefined,
    sortBy: 'date',
    query: '',
    layoutType: 'grid',
  });

  const setStatus = useCallback((status: string | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setSortBy = useCallback((sortBy: 'name' | 'date' | 'insights' | 'uploads') => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const setLayoutType = useCallback((layoutType: 'grid' | 'list') => {
    setFilters((prev) => ({ ...prev, layoutType }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: undefined,
      sortBy: 'date',
      query: '',
      layoutType: 'grid',
    });
  }, []);

  return {
    filters,
    setStatus,
    setSortBy,
    setQuery,
    setLayoutType,
    resetFilters,
  };
};
