import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { Language, ServiceId, ServiceType, SystemId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';
import { systemServicesKey } from './queries';

export function useAddService() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addService, isPending } = useMutation({
    mutationFn: (params: { systemId: SystemId; name: string; language: Language }) =>
      modelingService.addService({ type: ModelingCommandType.AddService, ...params }),
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: systemServicesKey(service.systemId) });
    },
  });

  return { addService, isPending };
}

export function useRenameService() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameService, isPending } = useMutation({
    mutationFn: (params: { serviceId: ServiceId; name: string; language: Language }) =>
      modelingService.renameService({ type: ModelingCommandType.RenameService, ...params }),
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: systemServicesKey(service.systemId) });
    },
  });

  return { renameService, isPending };
}

export function useEditServiceType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editServiceType, isPending } = useMutation({
    mutationFn: (params: { serviceId: ServiceId; serviceType: ServiceType }) =>
      modelingService.editServiceType({ type: ModelingCommandType.EditServiceType, ...params }),
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: systemServicesKey(service.systemId) });
    },
  });

  return { editServiceType, isPending };
}
