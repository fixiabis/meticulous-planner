'use client';

import { QueryProvider } from '@/components/base/query-provider';
import { ModelingSection } from '@/components/modeling/sections/modeling-section';

export default function Page() {
  return (
    <QueryProvider>
      <div className="w-screen h-screen">
        <ModelingSection />
      </div>
    </QueryProvider>
  );
}
