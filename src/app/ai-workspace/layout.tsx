import type { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';

interface AIWorkspaceLayoutProps {
  children: ReactNode;
}

export default function AIWorkspaceLayout({
  children,
}: AIWorkspaceLayoutProps): React.ReactElement {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
