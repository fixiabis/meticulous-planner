import { Model } from '@/models/modeling/model';
import { ProjectId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './use-modeling-service';

export type UseModels = {
  models: Model[];
  isLoading: boolean;
};

export function useModels(projectId: ProjectId): UseModels {
  const modelingService = useModelingService();

  const { data: models, isLoading } = useQuery({
    queryKey: ['models', `?projectId=${projectId}`],
    queryFn: () => modelingService.getProjectModels(projectId),
  });

  return { models: models ?? [], isLoading };
}
