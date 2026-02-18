import { ModelingQueryType } from '@/models/modeling/messages/queries';
import { ProjectId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './use-modeling-service';

export function useProjectModels(projectId: ProjectId | null) {
  const modelingService = useModelingService();

  const { data: models, isLoading } = useQuery({
    queryKey: ['models', `?projectId=${projectId}`],
    queryFn: () =>
      projectId ? modelingService.getProjectModels({ type: ModelingQueryType.GetProjectModels, projectId }) : [],
  });

  return { models: models ?? [], isLoading };
}
