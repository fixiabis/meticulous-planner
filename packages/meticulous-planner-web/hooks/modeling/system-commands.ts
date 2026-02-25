import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { Language, ProjectId, SystemId, SystemType } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';
import { systemKey, systemsKey } from './queries';

export function useAddSystem() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addSystem, isPending } = useMutation({
    mutationFn: (params: { systemId?: SystemId; projectId?: ProjectId | null; name: string; language: Language }) =>
      modelingService.addSystem({ type: ModelingCommandType.AddSystem, projectId: params.projectId ?? null, name: params.name, language: params.language }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemsKey() });
    },
  });

  return { addSystem, isPending };
}

export function useRenameSystem() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameSystem, isPending } = useMutation({
    mutationFn: (params: { systemId: SystemId; name: string; language: Language }) =>
      modelingService.renameSystem({ type: ModelingCommandType.RenameSystem, ...params }),
    onSuccess: (system) => {
      queryClient.invalidateQueries({ queryKey: systemKey(system.id) });
    },
  });

  return { renameSystem, isPending };
}

export function useEditSystemType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editSystemType, isPending } = useMutation({
    mutationFn: (params: { systemId: SystemId; systemType: SystemType }) =>
      modelingService.editSystemType({ type: ModelingCommandType.EditSystemType, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemsKey() });
    },
  });

  return { editSystemType, isPending };
}
