import { ModelingQueryType } from '@/models/modeling/messages/queries';
import { ModelId, ProjectId, SystemId } from '@/models/modeling/values';
import { useQuery } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

export const modelKey = (modelId: ModelId | null) => ['models', modelId];

export const systemModelsKey = (systemId: SystemId | null) => ['models', `?systemId=${systemId}`];

export const systemServicesKey = (systemId: SystemId | null) => ['services', `?systemId=${systemId}`];

export const systemsKey = () => ['systems'];

export const systemKey = (systemId: SystemId | null) => ['systems', systemId];

export const projectsKey = () => ['projects'];

export const projectKey = (projectId: ProjectId | null) => ['projects', projectId];

export const projectSystemsKey = (projectId: ProjectId | null) => ['systems', `?projectId=${projectId}`];

export function useModel(modelId: ModelId | null) {
  const modelingService = useModelingService();

  const { data: model, isLoading } = useQuery({
    queryKey: modelKey(modelId),
    queryFn: () => modelId && modelingService.getModel({ type: ModelingQueryType.GetModel, modelId }),
    enabled: Boolean(modelId),
  });

  return { model: model ?? null, isLoading };
}

export function useSystems() {
  const modelingService = useModelingService();

  const { data: systems, isLoading } = useQuery({
    queryKey: systemsKey(),
    queryFn: () => modelingService.getSystems({ type: ModelingQueryType.GetSystems }),
  });

  return { systems: systems ?? [], isLoading };
}

export function useSystemModels(systemId: SystemId | null) {
  const modelingService = useModelingService();

  const { data: models, isLoading } = useQuery({
    queryKey: systemModelsKey(systemId),
    queryFn: () =>
      systemId ? modelingService.getSystemModels({ type: ModelingQueryType.GetSystemModels, systemId: systemId }) : [],
    enabled: Boolean(systemId),
  });

  return { models: models ?? [], isLoading };
}

export function useSystem(systemId: SystemId | null) {
  const { systems, isLoading } = useSystems();
  const system = systems.find((s) => s.id === systemId) ?? null;
  return { system, isLoading };
}

export function useSystemServices(systemId: SystemId | null) {
  const modelingService = useModelingService();

  const { data: services, isLoading } = useQuery({
    queryKey: systemServicesKey(systemId),
    queryFn: () =>
      systemId
        ? modelingService.getSystemServices({ type: ModelingQueryType.GetSystemServices, systemId: systemId })
        : [],
    enabled: Boolean(systemId),
  });

  return { services: services ?? [], isLoading };
}

export function useProjects() {
  const modelingService = useModelingService();

  const { data: projects, isLoading } = useQuery({
    queryKey: projectsKey(),
    queryFn: () => modelingService.getProjects({ type: ModelingQueryType.GetProjects }),
  });

  return { projects: projects ?? [], isLoading };
}

export function useProject(projectId: ProjectId | null) {
  const { projects, isLoading } = useProjects();
  const project = projects.find((p) => p.id === projectId) ?? null;
  return { project, isLoading };
}

export function useProjectSystems(projectId: ProjectId | null) {
  const modelingService = useModelingService();

  const { data: systems, isLoading } = useQuery({
    queryKey: projectSystemsKey(projectId),
    queryFn: () =>
      projectId
        ? modelingService.getProjectSystems({ type: ModelingQueryType.GetProjectSystems, projectId })
        : [],
    enabled: Boolean(projectId),
  });

  return { systems: systems ?? [], isLoading };
}
