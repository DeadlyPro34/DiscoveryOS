'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectListHeader } from '@/components/projects/ProjectListHeader';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectCreateDialog } from '@/components/projects/ProjectCreateDialog';
import { ProjectEmptyState } from '@/components/projects/ProjectEmptyState';
import { useProjects } from '@/hooks/useProjects';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { useWorkspace } from '@/hooks/useWorkspace';
import { ProjectFormData } from '@/lib/projectSchema';

export default function ProjectsPage(): React.ReactElement {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const { filters, setStatus, setSortBy, setQuery, setLayoutType } = useProjectFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { projects, createProject } = useProjects({
    workspaceId: currentWorkspace?.id,
    status: filters.status,
    query: filters.query,
    sortBy: filters.sortBy,
  });

  const handleCreateProject = (data: ProjectFormData) => {
    if (!currentWorkspace) return;

    createProject({
      name: data.name,
      description: data.description || '',
      status: data.status,
      uploadCount: 0,
      insightsCount: 0,
      workspaceId: currentWorkspace.id,
    });

    setIsDialogOpen(false);
  };

  const handleSelectProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">No workspace selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Workspace: <span className="font-semibold">{currentWorkspace.name}</span>
        </p>
      </div>

      <ProjectListHeader
        query={filters.query}
        onQueryChange={setQuery}
        sortBy={filters.sortBy}
        onSortChange={setSortBy}
        status={filters.status}
        onStatusChange={setStatus}
        layoutType={filters.layoutType}
        onLayoutChange={setLayoutType}
        onCreateProject={() => setIsDialogOpen(true)}
      />

      {projects.length === 0 ? (
        <ProjectEmptyState onCreateProject={() => setIsDialogOpen(true)} />
      ) : filters.layoutType === 'grid' ? (
        <ProjectGrid
          projects={projects}
          onSelectProject={(project) => handleSelectProject(project.id)}
        />
      ) : (
        <ProjectList
          projects={projects}
          onSelectProject={(project) => handleSelectProject(project.id)}
        />
      )}

      <ProjectCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
