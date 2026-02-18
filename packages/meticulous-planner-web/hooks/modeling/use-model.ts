import { Model } from '@/models/modeling/model';
import { ModelId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './use-modeling-service';

export type UseModel = {
  model: Model | null;
  isLoading: boolean;
};

export function useModel(id: ModelId | null): UseModel {
  const modelingService = useModelingService();

  const { data: model, isLoading } = useQuery({
    queryKey: ['model', id],
    queryFn: () => id && modelingService.findModel(id),
  });

  return { model: model ?? null, isLoading };
}
