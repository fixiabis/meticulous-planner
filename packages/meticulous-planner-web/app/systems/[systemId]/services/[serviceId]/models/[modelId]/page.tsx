'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ModelEditor } from '@/components/modeling/blocks/model-editor';
import { ModelId, ServiceId, SystemId } from '@/models/modeling/values';
import { Button } from '@/components/ui/button';

export default function ModelPage({
  params,
}: {
  params: Promise<{ systemId: string; serviceId: string; modelId: string }>;
}) {
  const { systemId: systemIdStr, serviceId: serviceIdStr, modelId: modelIdStr } = use(params);
  const systemId = SystemId(systemIdStr);
  const serviceId = ServiceId(serviceIdStr);
  const modelId = ModelId(modelIdStr);
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.push(`/systems/${systemId}/services/${serviceId}`)}
        >
          ← 返回服務
        </Button>
      </div>
      <ModelEditor modelId={modelId} />
    </div>
  );
}
