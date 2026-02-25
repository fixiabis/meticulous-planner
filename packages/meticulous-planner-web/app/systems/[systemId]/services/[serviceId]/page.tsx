'use client';

import { use } from 'react';
import { ServiceEditor } from '@/components/modeling/blocks/service-editor';
import { ServiceId, SystemId } from '@/models/modeling/values';

export default function ServicePage({
  params,
}: {
  params: Promise<{ systemId: string; serviceId: string }>;
}) {
  const { systemId: systemIdStr, serviceId: serviceIdStr } = use(params);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ServiceEditor
        systemId={SystemId(systemIdStr)}
        serviceId={ServiceId(serviceIdStr)}
      />
    </div>
  );
}
