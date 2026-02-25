'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemModels } from '@/hooks/modeling/queries';
import { useAddModel, useRenameModel } from '@/hooks/modeling/model-commands';
import { ContentEditable } from '@/components/base/content-editable';
import { Language, ServiceId, SystemId } from '@/models/modeling/values';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export default function ServicePage({
  params,
}: {
  params: Promise<{ systemId: string; serviceId: string }>;
}) {
  const { systemId: systemIdStr, serviceId: serviceIdStr } = use(params);
  const systemId = SystemId(systemIdStr);
  const serviceId = ServiceId(serviceIdStr);
  const router = useRouter();
  const { models, isLoading } = useSystemModels(systemId);
  const { addModel, isPending } = useAddModel();
  const { renameModel } = useRenameModel();

  const serviceModels = models.filter((m) => m.serviceId === serviceId);

  const handleAddModel = async () => {
    const model = await addModel({
      systemId,
      serviceId,
      name: '',
      language: Language.Chinese,
    });
    router.push(`/systems/${systemId}/services/${serviceId}/models/${model.id}`);
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">載入中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {serviceModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <p className="text-muted-foreground">此服務尚未有任何模型</p>
          <Button onClick={handleAddModel} disabled={isPending}>
            新增第一個模型
          </Button>
        </div>
      ) : (
        <>
          <ul className="list-disc list-outside pl-5 space-y-1">
            {serviceModels.map((model) => (
              <li key={model.id} className="group flex items-center gap-2">
                <ContentEditable
                  className="block flex-1 py-1 text-sm"
                  content={model.descriptions[Language.Chinese]?.name ?? ''}
                  placeholder="尚未命名的模型"
                  onContentChange={(name) => {
                    if (name.trim() !== '') {
                      renameModel({ modelId: model.id, name, language: Language.Chinese });
                    }
                  }}
                />
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-opacity"
                  onClick={() => router.push(`/systems/${systemId}/services/${serviceId}/models/${model.id}`)}
                  title="開啟模型"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-muted-foreground w-full justify-start pl-1"
            onClick={handleAddModel}
            disabled={isPending}
          >
            + 新增模型
          </Button>
        </>
      )}
    </div>
  );
}
