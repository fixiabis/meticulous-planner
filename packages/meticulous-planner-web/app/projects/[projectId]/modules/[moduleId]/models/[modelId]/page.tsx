'use client';

import { useState } from 'react';
import { PanelLeft } from 'lucide-react';
import { WorkspaceSidebar } from '@/components/workspace-sidebar';
import { DocumentEditor } from '@/components/document-editor';
import { DocumentSheet } from '@/components/document-sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar with slide animation */}
      <div
        className={cn(
          'shrink-0 transition-[width,opacity] duration-300 ease-in-out overflow-hidden',
          sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0',
        )}
      >
        <WorkspaceSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <main className="relative flex-1 overflow-hidden">
        {/* Floating toggle when sidebar is closed */}
        <div
          className={cn(
            'absolute left-3 top-3 z-20 transition-opacity duration-200',
            sidebarOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-secondary hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </div>

        <DocumentEditor />
      </main>
      <DocumentSheet />
    </div>
  );
}
