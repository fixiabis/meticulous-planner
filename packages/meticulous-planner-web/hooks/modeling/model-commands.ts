import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, ServiceId, Stereotype, SystemId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';
import { modelKey, systemModelsKey } from './queries';

export function useAddModel() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModel, isPending } = useMutation({
    mutationFn: (params: { systemId: SystemId; serviceId: ServiceId; name: string; language: Language }) =>
      modelingService.addModel({ type: ModelingCommandType.AddModel, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { addModel, isPending };
}

export function useRenameModel() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameModel, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; name: string; language: Language }) =>
      modelingService.renameModel({ type: ModelingCommandType.RenameModel, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { renameModel, isPending };
}

export function useEditModelStereotype() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelStereotype, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; stereotype: Stereotype }) =>
      modelingService.editModelStereotype({ type: ModelingCommandType.EditModelStereotype, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { editModelStereotype, isPending };
}

export function useEditModelGeneralizationType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelGeneralizationType, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; generalizationType: TypeReference | null }) =>
      modelingService.editModelGeneralizationType({ type: ModelingCommandType.EditModelGeneralizationType, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { editModelGeneralizationType, isPending };
}

export function useMoveModelToService() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: moveModelToService, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; serviceId: ServiceId | null }) =>
      modelingService.moveModelToService({ type: ModelingCommandType.MoveModelToService, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { moveModelToService, isPending };
}
