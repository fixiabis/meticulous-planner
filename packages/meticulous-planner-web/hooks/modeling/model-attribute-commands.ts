import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { TypeReference } from '@/models/modeling/type-reference';
import { AttributeId, Language, ModelId, Multiplicity } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

function invalidateModel(queryClient: ReturnType<typeof useQueryClient>, modelId: ModelId, projectId: string | null) {
  queryClient.invalidateQueries({ queryKey: ['model', modelId] });
  if (projectId) {
    queryClient.invalidateQueries({ queryKey: ['models', `?projectId=${projectId}`] });
  }
}

export function useAddModelAttribute() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModelAttribute, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; attributeId: AttributeId }) =>
      modelingService.addModelAttribute({ type: ModelingCommandType.AddModelAttribute, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { addModelAttribute, isPending };
}

export function useRemoveModelAttribute() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeModelAttribute, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; attributeId: AttributeId }) =>
      modelingService.removeModelAttribute({ type: ModelingCommandType.RemoveModelAttribute, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { removeModelAttribute, isPending };
}

export function useRemoveAllModelAttributes() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeAllModelAttributes, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId }) =>
      modelingService.removeAllModelAttributes({ type: ModelingCommandType.RemoveAllModelAttributes, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { removeAllModelAttributes, isPending };
}

export function useRenameModelAttribute() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameModelAttribute, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; attributeId: AttributeId; name: string; language: Language }) =>
      modelingService.renameModelAttribute({ type: ModelingCommandType.RenameModelAttribute, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { renameModelAttribute, isPending };
}

export function useEditModelAttributeType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelAttributeType, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; attributeId: AttributeId; attributeType: TypeReference }) =>
      modelingService.editModelAttributeType({ type: ModelingCommandType.EditModelAttributeType, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { editModelAttributeType, isPending };
}

export function useEditModelAttributeMultiplicity() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelAttributeMultiplicity, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; attributeId: AttributeId; multiplicity: Multiplicity }) =>
      modelingService.editModelAttributeMultiplicity({
        type: ModelingCommandType.EditModelAttributeMultiplicity,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { editModelAttributeMultiplicity, isPending };
}
