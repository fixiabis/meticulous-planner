import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { Language, ModuleId, ProjectId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

export function useAddModule() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModule, isPending } = useMutation({
    mutationFn: (params: { projectId: ProjectId; name: string; language: Language }) =>
      modelingService.addModule({ type: ModelingCommandType.AddModule, ...params }),
    onSuccess: (newModule) => {
      queryClient.invalidateQueries({ queryKey: ['modules', `?projectId=${newModule.projectId}`] });
    },
  });

  return { addModule, isPending };
}

export function useRenameModule() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameModule, isPending } = useMutation({
    mutationFn: (params: { moduleId: ModuleId; name: string; language: Language }) =>
      modelingService.renameModule({ type: ModelingCommandType.RenameModule, ...params }),
    onSuccess: (updatedModule) => {
      queryClient.invalidateQueries({ queryKey: ['modules', `?projectId=${updatedModule.projectId}`] });
    },
  });

  return { renameModule, isPending };
}
