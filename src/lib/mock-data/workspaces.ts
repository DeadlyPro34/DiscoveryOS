import { Workspace } from '@/types/workspace';

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'ws-001',
    name: 'Slack Feedback',
    logo: '💬',
    members: ['alex@company.com', 'sarah@company.com', 'mike@company.com'],
    createdDate: new Date('2024-01-15'),
    projectsCount: 8,
  },
  {
    id: 'ws-002',
    name: 'Customer Interviews',
    logo: '🎤',
    members: ['sarah@company.com', 'james@company.com', 'emma@company.com', 'david@company.com'],
    createdDate: new Date('2024-02-10'),
    projectsCount: 12,
  },
  {
    id: 'ws-003',
    name: 'Mobile Beta',
    logo: '📱',
    members: ['mike@company.com', 'emma@company.com'],
    createdDate: new Date('2024-01-05'),
    projectsCount: 5,
  },
  {
    id: 'ws-004',
    name: 'Q2 User Research',
    logo: '📊',
    members: ['alex@company.com', 'james@company.com', 'lisa@company.com', 'tom@company.com', 'rachel@company.com'],
    createdDate: new Date('2024-03-20'),
    projectsCount: 15,
  },
  {
    id: 'ws-005',
    name: 'Enterprise Clients',
    logo: '🏢',
    members: ['david@company.com', 'rachel@company.com'],
    createdDate: new Date('2024-02-28'),
    projectsCount: 6,
  },
];
