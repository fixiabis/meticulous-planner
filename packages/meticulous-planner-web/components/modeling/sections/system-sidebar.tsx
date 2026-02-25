'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useSystemServices, useSystemModels } from '@/hooks/modeling/queries';
import { useAddService } from '@/hooks/modeling/service-commands';
import { useAddModel } from '@/hooks/modeling/model-commands';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Language, ServiceId, SystemId } from '@/models/modeling/values';

export type SystemSidebarProps = {
  systemId: SystemId;
};

export function SystemSidebar({ systemId }: SystemSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { services } = useSystemServices(systemId);
  const { models } = useSystemModels(systemId);
  const { addService, isPending: isAddingService } = useAddService();
  const { addModel } = useAddModel();
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  const toggleService = (serviceId: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  };

  const handleAddService = async () => {
    const service = await addService({
      systemId,
      name: '新服務',
      language: Language.Chinese,
    });
    router.push(`/systems/${systemId}/services/${service.id}`);
  };

  const handleAddModel = async (serviceId: ServiceId) => {
    const model = await addModel({
      systemId,
      serviceId,
      name: '新模型',
      language: Language.Chinese,
    });
    router.push(`/systems/${systemId}/services/${serviceId}/models/${model.id}`);
  };

  const userServices = services.filter((s) => !s.isBase);

  return (
    <aside className="w-64 shrink-0 border-r bg-background flex flex-col h-full">
      <div className="p-3 border-b">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => router.push('/')}
        >
          ← 所有系統
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {userServices.map((service) => {
            const serviceModels = models.filter((m) => m.serviceId === service.id);
            const isExpanded = expandedServices.has(service.id);
            const serviceHref = `/systems/${systemId}/services/${service.id}`;
            const isServiceActive = pathname === serviceHref;

            return (
              <div key={service.id}>
                <div className="flex items-center group">
                  <button
                    className="p-1 hover:bg-accent rounded"
                    onClick={() => toggleService(service.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    className={cn(
                      'flex-1 text-left px-2 py-1 text-sm rounded hover:bg-accent truncate',
                      isServiceActive && 'bg-accent font-medium',
                    )}
                    onClick={() => router.push(serviceHref)}
                  >
                    {service.descriptions[Language.Chinese]?.name || '未命名服務'}
                  </button>
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded"
                    onClick={() => handleAddModel(service.id)}
                    title="新增模型"
                  >
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
                {isExpanded && (
                  <div className="ml-6">
                    {serviceModels.map((model) => {
                      const modelHref = `/systems/${systemId}/services/${service.id}/models/${model.id}`;
                      const isModelActive = pathname === modelHref;
                      return (
                        <button
                          key={model.id}
                          className={cn(
                            'w-full text-left px-2 py-1 text-sm rounded hover:bg-accent truncate block',
                            isModelActive && 'bg-accent font-medium',
                          )}
                          onClick={() => router.push(modelHref)}
                        >
                          {model.descriptions[Language.Chinese]?.name || '未命名模型'}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleAddService}
          disabled={isAddingService}
        >
          <Plus className="h-4 w-4 mr-1" />
          新增服務
        </Button>
      </div>
    </aside>
  );
}
