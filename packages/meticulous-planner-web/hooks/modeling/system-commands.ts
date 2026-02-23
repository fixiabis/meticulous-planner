import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { Language, SystemId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';
import { systemKey, systemsKey } from './queries';

export function useAddSystem() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addSystem, isPending } = useMutation({
    mutationFn: (params: { systemId: SystemId; name: string; language: Language }) =>
      modelingService.addSystem({ type: ModelingCommandType.AddSystem, ...params }),
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
