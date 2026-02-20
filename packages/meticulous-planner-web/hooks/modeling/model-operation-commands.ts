import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, Multiplicity, OperationId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

function invalidateModel(queryClient: ReturnType<typeof useQueryClient>, modelId: ModelId, systemId: string | null) {
  queryClient.invalidateQueries({ queryKey: ['model', modelId] });
  if (systemId) {
    queryClient.invalidateQueries({ queryKey: ['models', `?systemId=${systemId}`] });
  }
}

export function useAddModelOperation() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModelOperation, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId }) =>
      modelingService.addModelOperation({ type: ModelingCommandType.AddModelOperation, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.systemId),
  });

  return { addModelOperation, isPending };
}

export function useRemoveModelOperation() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeModelOperation, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId }) =>
      modelingService.removeModelOperation({ type: ModelingCommandType.RemoveModelOperation, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.systemId),
  });

  return { removeModelOperation, isPending };
}

export function useRemoveAllModelOperations() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeAllModelOperations, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId }) =>
      modelingService.removeAllModelOperations({ type: ModelingCommandType.RemoveAllModelOperations, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.systemId),
  });

  return { removeAllModelOperations, isPending };
}

export function useRenameModelOperation() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameModelOperation, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId; name: string; language: Language }) =>
      modelingService.renameModelOperation({ type: ModelingCommandType.RenameModelOperation, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.systemId),
  });

  return { renameModelOperation, isPending };
}

export function useEditModelOperationReturnType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelOperationReturnType, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId; returnType: TypeReference }) =>
      modelingService.editModelOperationReturnType({
        type: ModelingCommandType.EditModelOperationReturnType,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.systemId),
  });

  return { editModelOperationReturnType, isPending };
}

export function useEditModelOperationMultiplicity() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelOperationMultiplicity, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId; multiplicity: Multiplicity }) =>
      modelingService.editModelOperationMultiplicity({
        type: ModelingCommandType.EditModelOperationMultiplicity,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.systemId),
  });

  return { editModelOperationMultiplicity, isPending };
}
