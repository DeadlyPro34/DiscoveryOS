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
    <div className="flex flex-col items-center justify-center bg-white border-[3px] border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-[28px] py-[60px] px-[24px] text-center">
      <div className="mb-4 text-4xl">📁</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {onCreateProject && (
        <button
          onClick={onCreateProject}
          className="inline-flex items-center justify-center gap-2 bg-[#4DD9AC] text-black border-[3px] border-black rounded-xl px-6 py-2 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all"
        >
          <span>+</span>
          Create Project
        </button>
      )}
    </div>
  );
};
