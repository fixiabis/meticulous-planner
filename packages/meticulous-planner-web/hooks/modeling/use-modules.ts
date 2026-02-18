import { Module } from '@/models/modeling/module';
import { ProjectId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './use-modeling-service';
import { ModelingQueryType } from '@/models/modeling/messages/queries';

export function useProjectModules(projectId: ProjectId | null) {
  const modelingService = useModelingService();

  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules', `?projectId=${projectId}`],
    queryFn: () =>
      projectId ? modelingService.getProjectModules({ type: ModelingQueryType.GetProjectModules, projectId }) : [],
  });

  return { modules: modules ?? [], isLoading };
}
