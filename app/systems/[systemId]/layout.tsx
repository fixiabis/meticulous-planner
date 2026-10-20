'use client';

import { use } from 'react';
import { SystemSidebar } from '@/components/modeling/sections/system-sidebar';
import { SystemId } from '@/models/modeling/values';

export default function SystemLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ systemId: string }>;
}) {
  const { systemId } = use(params);

  return (
    <div className="flex h-screen overflow-hidden">
      <SystemSidebar systemId={SystemId(systemId)} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
