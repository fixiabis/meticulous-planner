'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModelId, SystemId } from '@/models/modeling/values';

export default function ModelPageRedirect({
  params,
}: {
  params: Promise<{ systemId: string; serviceId: string; modelId: string }>;
}) {
  const { systemId: systemIdStr, modelId: modelIdStr } = use(params);
  const systemId = SystemId(systemIdStr);
  const modelId = ModelId(modelIdStr);

  const router = useRouter();

  useEffect(() => {
    router.replace(`/systems/${systemId}/models/${modelId}`);
  }, [router, systemId, modelId]);

  return null;
}
