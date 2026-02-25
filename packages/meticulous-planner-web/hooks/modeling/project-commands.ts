import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { Language, ProjectId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';
import { projectKey, projectsKey } from './queries';

export function useAddProject() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addProject, isPending } = useMutation({
    mutationFn: (params: { projectId: ProjectId; name: string; language: Language }) =>
      modelingService.addProject({ type: ModelingCommandType.AddProject, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey() });
    },
  });

  return { addProject, isPending };
}

export function useRenameProject() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameProject, isPending } = useMutation({
    mutationFn: (params: { projectId: ProjectId; name: string; language: Language }) =>
      modelingService.renameProject({ type: ModelingCommandType.RenameProject, ...params }),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: projectKey(project.id) });
      queryClient.invalidateQueries({ queryKey: projectsKey() });
    },
  });

  return { renameProject, isPending };
}
