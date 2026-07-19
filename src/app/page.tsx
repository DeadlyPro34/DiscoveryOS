'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useProjects } from '@/hooks/useProjects';
import { ArrowRight } from 'lucide-react';

export default function HomePage(): React.ReactElement {
  const { currentWorkspace } = useWorkspace();
  const { projects } = useProjects({
    workspaceId: currentWorkspace?.id,
    sortBy: 'date',
  });

  const recentProjects = projects.slice(0, 4);
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const processingProjects = projects.filter(p => p.status === 'Processing').length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-2">Welcome to DiscoveryOS</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Every product decision backed by customer evidence.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your customer research into evidence-backed insights. Transform conversations into actionable product decisions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {processingProjects} processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedProjects}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              research cycles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold truncate">{currentWorkspace?.name || 'None'}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {currentWorkspace?.members.length || 0} members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link href="/projects">
            <Button variant="ghost" className="gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No projects yet</p>
              <Link href="/projects">
                <Button>Create your first project</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {recentProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {project.status}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {project.uploadCount} uploads · {project.insightsCount} insights
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Here's what you can do with DiscoveryOS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-lg">📁</span>
              <div>
                <p className="font-medium">Create Projects</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize your research by project to track progress and insights
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lg">📤</span>
              <div>
                <p className="font-medium">Upload Research</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add customer interviews, surveys, and feedback data to your projects
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="font-medium">Generate Insights</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered analysis transforms raw data into actionable insights
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-lg">📊</span>
              <div>
                <p className="font-medium">Create Reports</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share evidence-backed findings with your team and stakeholders
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
