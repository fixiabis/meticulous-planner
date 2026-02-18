import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, Multiplicity, OperationId, ParameterId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './use-modeling-service';

function invalidateModel(queryClient: ReturnType<typeof useQueryClient>, modelId: ModelId, projectId: string | null) {
  queryClient.invalidateQueries({ queryKey: ['model', modelId] });
  if (projectId) {
    queryClient.invalidateQueries({ queryKey: ['models', `?projectId=${projectId}`] });
  }
}

export function useAddModelOperationParameter() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModelOperationParameter, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId; parameterId: ParameterId }) =>
      modelingService.addModelOperationParameter({
        type: ModelingCommandType.AddModelOperationParameter,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { addModelOperationParameter, isPending };
}

export function useRemoveModelOperationParameter() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeModelOperationParameter, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId; parameterId: ParameterId }) =>
      modelingService.removeModelOperationParameter({
        type: ModelingCommandType.RemoveModelOperationParameter,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { removeModelOperationParameter, isPending };
}

export function useRemoveAllModelOperationParameters() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeAllModelOperationParameters, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; operationId: OperationId }) =>
      modelingService.removeAllModelOperationParameters({
        type: ModelingCommandType.RemoveAllModelOperationParameters,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { removeAllModelOperationParameters, isPending };
}

export function useRenameModelOperationParameter() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameModelOperationParameter, isPending } = useMutation({
    mutationFn: (params: {
      modelId: ModelId;
      operationId: OperationId;
      parameterId: ParameterId;
      name: string;
      language: Language;
    }) =>
      modelingService.renameModelOperationParameter({
        type: ModelingCommandType.RenameModelOperationParameter,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { renameModelOperationParameter, isPending };
}

export function useEditModelOperationParameterType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelOperationParameterType, isPending } = useMutation({
    mutationFn: (params: {
      modelId: ModelId;
      operationId: OperationId;
      parameterId: ParameterId;
      parameterType: TypeReference;
    }) =>
      modelingService.editModelOperationParameterType({
        type: ModelingCommandType.EditModelOperationParameterType,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { editModelOperationParameterType, isPending };
}

export function useEditModelOperationParameterMultiplicity() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelOperationParameterMultiplicity, isPending } = useMutation({
    mutationFn: (params: {
      modelId: ModelId;
      operationId: OperationId;
      parameterId: ParameterId;
      multiplicity: Multiplicity;
    }) =>
      modelingService.editModelOperationParameterMultiplicity({
        type: ModelingCommandType.EditModelOperationParameterMultiplicity,
        ...params,
      }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { editModelOperationParameterMultiplicity, isPending };
}
