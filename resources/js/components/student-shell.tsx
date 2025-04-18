import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { SidebarProvider } from './ui/sidebar';

interface StudentShellProps {
  children: React.ReactNode;
  variant?: 'header' | 'sidebar';
}

export function StudentShell({
  children,
  variant = 'header',
}: StudentShellProps) {
  const isOpen = usePage<SharedData>().props.sidebarOpen;

  if (variant === 'header') {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>;
  }

  return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
