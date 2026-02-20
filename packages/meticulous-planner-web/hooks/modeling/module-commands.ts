import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { Language, ServiceId, SystemId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

export function useAddService() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addSystem, isPending } = useMutation({
    mutationFn: (params: { systemId: SystemId; name: string; language: Language }) =>
      modelingService.addService({ type: ModelingCommandType.AddService, ...params }),
    onSuccess: (newService) => {
      queryClient.invalidateQueries({ queryKey: ['services', `?systemId=${newService.systemId}`] });
    },
  });

  return { addSystem, isPending };
}

export function useRenameService() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameService, isPending } = useMutation({
    mutationFn: (params: { serviceId: ServiceId; name: string; language: Language }) =>
      modelingService.renameService({ type: ModelingCommandType.RenameService, ...params }),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ queryKey: ['services', `?systemId=${updatedService.systemId}`] });
    },
  });

  return { renameService, isPending };
}
