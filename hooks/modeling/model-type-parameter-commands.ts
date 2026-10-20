import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, TypeParameterId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';
import { modelKey, systemModelsKey } from './queries';

export function useAddModelTypeParameter() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModelTypeParameter, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId }) =>
      modelingService.addModelTypeParameter({ type: ModelingCommandType.AddModelTypeParameter, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { addModelTypeParameter, isPending };
}

export function useRemoveModelTypeParameter() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeModelTypeParameter, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; typeParameterId: TypeParameterId }) =>
      modelingService.removeModelTypeParameter({ type: ModelingCommandType.RemoveModelTypeParameter, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { removeModelTypeParameter, isPending };
}

export function useRemoveAllModelTypeParameters() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeAllModelTypeParameters, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId }) =>
      modelingService.removeAllModelTypeParameters({
        type: ModelingCommandType.RemoveAllModelTypeParameters,
        ...params,
      }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { removeAllModelTypeParameters, isPending };
}

export function useRenameModelTypeParameter() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameModelTypeParameter, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; typeParameterId: TypeParameterId; name: string; language: Language }) =>
      modelingService.renameModelTypeParameter({ type: ModelingCommandType.RenameModelTypeParameter, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { renameModelTypeParameter, isPending };
}

export function useEditModelTypeParameterConstraintType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelTypeParameterConstraintType, isPending } = useMutation({
    mutationFn: (params: {
      modelId: ModelId;
      typeParameterId: TypeParameterId;
      constraintType: TypeReference | null;
    }) =>
      modelingService.editModelTypeParameterConstraintType({
        type: ModelingCommandType.EditModelTypeParameterConstraintType,
        ...params,
      }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { editModelTypeParameterConstraintType, isPending };
}
