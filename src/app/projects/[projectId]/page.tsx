'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { useUploads } from '@/hooks/useUploads';
import { useAIContextStore } from '@/lib/aiContextStore';
import { UploadArea } from '@/components/uploads/UploadArea';
import { DocumentList } from '@/components/uploads/DocumentList';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const { projects } = useProjects();
  const { documents, addDocument, updateDocumentStatus, updateDocumentProgress, deleteDocument } = useUploads(projectId);
  const { addContext } = useAIContextStore();
  const [project, setProject] = useState(projects.find(p => p.id === projectId));

  useEffect(() => {
    setProject(projects.find(p => p.id === projectId));
  }, [projects, projectId]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <Button onClick={() => router.push('/projects')}>Go back to Projects</Button>
      </div>
    );
  }

  const handleFilesSelected = async (files: File[]) => {
    // Process each file
    for (const file of files) {
      const uploadId = `upl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      addDocument({
        id: uploadId,
        projectId,
        name: file.name,
        type: 'PDF',
        size: file.size,
        status: 'Uploading',
        uploadProgress: 0,
        uploadedAt: new Date()
      });

      try {
        // Upload to our new backend API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);
        if (project.workspaceId) {
          formData.append('workspaceId', project.workspaceId);
        }

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (progress <= 100) {
            updateDocumentProgress(uploadId, progress);
          }
        }, 300);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(interval);
        updateDocumentProgress(uploadId, 100);

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        updateDocumentStatus(uploadId, 'Processing');

        // Wait for AI processing to finish
        const result = await response.json();
        
        // Map the multi-agent results into local chunks for the Chatbot
        if (result.context && result.context.results) {
          const newChunks = result.context.results.map((agentRes: any, index: number) => ({
            id: `chunk-${Date.now()}-${index}`,
            content: `Agent: ${agentRes.agentId}\n\n${JSON.stringify(agentRes.output, null, 2)}`,
            similarity: 0.95,
            metadata: {
              source: file.name,
              projectId,
              agentId: agentRes.agentId
            }
          }));
          addContext(newChunks);
        }

        updateDocumentStatus(uploadId, 'Completed');

      } catch (err) {
        console.error(err);
        updateDocumentStatus(uploadId, 'Failed');
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.push('/projects')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Upload Research Data</h2>
            <UploadArea 
              projectId={projectId} 
              onFilesSelected={handleFilesSelected}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Documents</h2>
            <DocumentList 
              documents={documents} 
              onRetry={(id) => console.log('Retry not implemented for uploaded files')}
              onDelete={deleteDocument}
            />
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white border-[3px] border-black p-6 shadow-neo">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6" /> AI Status
            </h3>
            <p className="text-gray-700 mb-6">
              When you upload files, our AI Agents will automatically parse the text, identify pain points, and generate insights.
            </p>
            <Button 
              className="w-full bg-accent hover:bg-[#ffe600] text-black border-[2px] border-black"
              onClick={() => router.push('/ai-workspace')}
            >
              Go to AI Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
