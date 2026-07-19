import { z } from 'zod';

export const workspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100, 'Workspace name must be less than 100 characters'),
  logo: z.string().optional(),
});

export type WorkspaceFormData = z.infer<typeof workspaceSchema>;
