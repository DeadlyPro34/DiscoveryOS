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
        type: 'pdf',
        size: file.size,
        status: 'Uploading',
        uploadProgress: 0,
        createdDate: new Date(),
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
    <div className="w-[95%] max-w-6xl mx-auto pb-20">
      <div className="pt-28 pb-[16px] flex items-center gap-4 border-b-[3px] border-black mb-8 bg-transparent">
        <button 
          onClick={() => router.push('/projects')} 
          className="flex items-center justify-center h-[38px] px-3 bg-[#fff] border-[1.5px] border-[#d0d0d0] rounded-[8px] text-sm font-medium hover:bg-gray-50 transition-colors gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div>
          <h1 className="text-[22px] font-[700] text-[#111] leading-none">{project.name}</h1>
          {project.description && <p className="text-[13px] text-[#777] mt-1">{project.description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-[22px] font-[700] text-[#111] mb-4">Upload Research Data</h2>
            <UploadArea 
              projectId={projectId} 
              onFilesSelected={handleFilesSelected}
            />
          </section>

          <section>
            <h2 className="text-[22px] font-[700] text-[#111] mb-4">Documents</h2>
            <DocumentList 
              documents={documents} 
              onRetry={(id) => console.log('Retry not implemented for uploaded files')}
              onDelete={deleteDocument}
            />
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-[#fff] border-[1.5px] border-[#e5e5e5] rounded-[14px] p-6">
            <h3 className="text-[18px] font-[700] mb-4 flex items-center gap-2 text-[#111]">
              <Brain className="w-6 h-6 text-[#111]" /> AI Status
            </h3>
            <p className="text-[#777] text-sm mb-6 leading-relaxed">
              When you upload files, our AI Agents will automatically parse the text, identify pain points, and generate insights.
            </p>
            <button 
              className="w-full flex justify-center items-center h-[38px] bg-[#111] hover:bg-black/80 text-[#fff] border-[1.5px] border-[#111] rounded-[8px] text-sm font-[600] transition-colors"
              onClick={() => router.push('/ai-workspace')}
            >
              Go to AI Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
