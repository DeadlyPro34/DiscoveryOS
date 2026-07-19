'use client';

import React from 'react';

interface ProjectEmptyStateProps {
  title?: string;
  description?: string;
  onCreateProject?: () => void;
}

export const ProjectEmptyState: React.FC<ProjectEmptyStateProps> = ({
  title = 'No projects yet',
  description = 'Create your first project to start organizing your research and insights.',
  onCreateProject,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-4 text-4xl">📁</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {onCreateProject && (
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <span>+</span>
          Create Project
        </button>
      )}
    </div>
  );
};
