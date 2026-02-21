import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { Language, ServiceId, SystemId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

export function useAddSystem() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addSystem, isPending } = useMutation({
    mutationFn: (params: { systemId: SystemId; name: string; language: Language }) =>
      modelingService.addSystem({ type: ModelingCommandType.AddSystem, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
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
    onSuccess: (updatedSystem) => {
      queryClient.invalidateQueries({ queryKey: ['systems', updatedSystem.id] });
    },
  });

  return { renameSystem, isPending };
}
