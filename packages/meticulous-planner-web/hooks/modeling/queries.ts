import { ModelingQueryType } from '@/models/modeling/messages/queries';
import { ModelId, SystemId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

export function useModel(modelId: ModelId | null) {
  const modelingService = useModelingService();

  const { data: model, isLoading } = useQuery({
    queryKey: ['model', modelId],
    queryFn: () => modelId && modelingService.getModel({ type: ModelingQueryType.GetModel, modelId }),
    enabled: Boolean(modelId),
  });

  return { model: model ?? null, isLoading };
}

export function useSystems() {
  const modelingService = useModelingService();

  const { data: systems, isLoading } = useQuery({
    queryKey: ['systems'],
    queryFn: () => modelingService.getSystems({ type: ModelingQueryType.GetSystems }),
  });

  return { systems: systems ?? [], isLoading };
}

export function useSystemModels(systemId: SystemId | null) {
  const modelingService = useModelingService();

  const { data: models, isLoading } = useQuery({
    queryKey: ['models', `?systemId=${systemId}`],
    queryFn: () =>
      systemId
        ? modelingService.getSystemModels({ type: ModelingQueryType.GetSystemModels, systemId: systemId })
        : [],
    enabled: Boolean(systemId),
  });

  return { models: models ?? [], isLoading };
}

export function useSystemServices(systemId: SystemId | null) {
  const modelingService = useModelingService();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', `?systemId=${systemId}`],
    queryFn: () =>
      systemId
        ? modelingService.getSystemServices({ type: ModelingQueryType.GetSystemServices, systemId: systemId })
        : [],
    enabled: Boolean(systemId),
  });

  return { services: services ?? [], isLoading };
}
