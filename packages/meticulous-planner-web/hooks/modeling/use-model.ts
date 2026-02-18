import { ModelingQueryType } from '@/models/modeling/messages/queries';
import { ModelId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './use-modeling-service';

export function useModel(modelId: ModelId | null) {
  const modelingService = useModelingService();

  const { data: model, isLoading } = useQuery({
    queryKey: ['model', modelId],
    queryFn: () => modelId && modelingService.getModel({ type: ModelingQueryType.GetModel, modelId }),
  });

  return { model: model ?? null, isLoading };
}
