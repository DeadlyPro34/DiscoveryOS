import type { ReactNode } from 'react';

interface AIWorkspaceLayoutProps {
  children: ReactNode;
}

export default function AIWorkspaceLayout({
  children,
}: AIWorkspaceLayoutProps): React.ReactElement {
  return <>{children}</>;
}
