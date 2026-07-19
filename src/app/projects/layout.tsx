import type { Metadata } from 'next';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'DiscoveryOS - Projects',
  description: 'Manage your research projects',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
