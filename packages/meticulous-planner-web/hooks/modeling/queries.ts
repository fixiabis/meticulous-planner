import { ModelingQueryType } from '@/models/modeling/messages/queries';
import { ModelId, ProjectId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

export function useModel(modelId: ModelId | null) {
  const modelingService = useModelingService();

  const { data: model, isLoading } = useQuery({
    queryKey: ['model', modelId],
    queryFn: () => modelId && modelingService.getModel({ type: ModelingQueryType.GetModel, modelId }),
  });

  return { model: model ?? null, isLoading };
}

export function useProjectModels(projectId: ProjectId | null) {
  const modelingService = useModelingService();

  const { data: models, isLoading } = useQuery({
    queryKey: ['models', `?projectId=${projectId}`],
    queryFn: () => projectId ? modelingService.getProjectModels({ type: ModelingQueryType.GetProjectModels, projectId }) : [],
  });

  return { models: models ?? [], isLoading };
}

export function useProjectModules(projectId: ProjectId | null) {
  const modelingService = useModelingService();

  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules', `?projectId=${projectId}`],
    queryFn: () => projectId ? modelingService.getProjectModules({ type: ModelingQueryType.GetProjectModules, projectId }) : [],
  });

  return { modules: modules ?? [], isLoading };
}

