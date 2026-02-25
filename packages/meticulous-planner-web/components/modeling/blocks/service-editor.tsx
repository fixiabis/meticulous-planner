'use client';

import { useRouter } from 'next/navigation';
import { ContentEditable } from '@/components/base/content-editable';
import { DropdownMenu } from '@/components/base/dropdown-menu';
import { ServiceTypeSelect } from '@/components/modeling/elements/service-type-select';
import { useSystemModels, useSystemServices } from '@/hooks/modeling/queries';
import { useAddModel, useRenameModel } from '@/hooks/modeling/model-commands';
import { useEditServiceType, useRenameService } from '@/hooks/modeling/service-commands';
import { Language, ServiceId, SystemId } from '@/models/modeling/values';

export type ServiceEditorProps = {
  systemId: SystemId;
  serviceId: ServiceId;
};

export function ServiceEditor({ systemId, serviceId }: ServiceEditorProps) {
  const router = useRouter();
  const { services } = useSystemServices(systemId);
  const { models } = useSystemModels(systemId);
  const { addModel } = useAddModel();
  const { renameModel } = useRenameModel();
  const { renameService } = useRenameService();
  const { editServiceType } = useEditServiceType();

  const service = services.find((s) => s.id === serviceId) ?? null;

  const serviceModels = models.filter((m) => m.serviceId === serviceId);

  const handleAddModel = async () => {
    const model = await addModel({
      systemId,
      serviceId,
      name: '',
      language: Language.Chinese,
    });
    router.push(`/systems/${systemId}/models/${model.id}`);
  };

  return (
    <div className="p-4 space-y-1">
      <h1 className="text-2xl font-bold mb-2">
        <ContentEditable
          className={service?.descriptions[Language.Chinese]?.name ? '' : 'inline-block min-w-32'}
          content={service?.descriptions[Language.Chinese]?.name ?? ''}
          placeholder="服務名稱"
          onContentChange={(name) => {
            if (name.trim() !== '') {
              renameService({ serviceId, name, language: Language.Chinese });
            }
          }}
        />
      </h1>
      {service && (
        <p>
          是一個{' '}
          <ServiceTypeSelect
            value={service.serviceType}
            onChange={(serviceType) => editServiceType({ serviceId, serviceType })}
          />{' '}
          服務
        </p>
      )}
      <p className="group/models">
        {serviceModels.length === 0 ? '暫無任何模型' : '包含以下模型：'}
        <DropdownMenu items={[{ label: '新增模型', onSelect: handleAddModel }]}>
          <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/models:opacity-100"> ...</span>
        </DropdownMenu>
      </p>
      {serviceModels.length > 0 && (
        <ul className="list-disc list-outside pl-6">
          {serviceModels.map((model) => (
            <li key={model.id} className="relative group/model">
              <ContentEditable
                content={model.descriptions[Language.Chinese]?.name ?? ''}
                placeholder="尚未命名的模型"
                onContentChange={(name) => {
                  if (name.trim() !== '') {
                    renameModel({ modelId: model.id, name, language: Language.Chinese });
                  }
                }}
              />
              <DropdownMenu
                items={[
                  {
                    label: '開啟模型',
                    onSelect: () => router.push(`/systems/${systemId}/models/${model.id}`),
                  },
                  { label: '新增模型', onSelect: handleAddModel },
                ]}
              >
                <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/model:opacity-100">
                  {' '}
                  ...
                </span>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
