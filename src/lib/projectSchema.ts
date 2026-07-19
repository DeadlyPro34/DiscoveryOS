import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().default(''),
  status: z.enum(['Research', 'Processing', 'Completed', 'Archived']),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
