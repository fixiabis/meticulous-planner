'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemServices } from '@/hooks/modeling/queries';
import { useAddService } from '@/hooks/modeling/service-commands';
import { Language, SystemId } from '@/models/modeling/values';
import { Button } from '@/components/ui/button';

export default function SystemPage({
  params,
}: {
  params: Promise<{ systemId: string }>;
}) {
  const { systemId: systemIdStr } = use(params);
  const systemId = SystemId(systemIdStr);
  const router = useRouter();
  const { services, isLoading } = useSystemServices(systemId);
  const { addService, isPending } = useAddService();

  const userServices = services.filter((s) => !s.isBase);

  useEffect(() => {
    if (!isLoading && userServices.length > 0) {
      router.replace(`/systems/${systemId}/services/${userServices[0].id}`);
    }
  }, [isLoading, userServices.length, systemId, router]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">載入中...</div>;
  }

  if (userServices.length > 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">跳轉中...</div>;
  }

  const handleAddService = async () => {
    const service = await addService({
      systemId,
      name: '新服務',
      language: Language.Chinese,
    });
    router.push(`/systems/${systemId}/services/${service.id}`);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">此系統尚未有任何服務</p>
      <Button onClick={handleAddService} disabled={isPending}>
        新增第一個服務
      </Button>
    </div>
  );
}
