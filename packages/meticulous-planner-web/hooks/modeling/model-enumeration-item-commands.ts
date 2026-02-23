import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { EnumerationItemId, Language, ModelId } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';
import { modelKey, systemModelsKey } from './queries';

export function useAddModelEnumerationItem() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModelEnumerationItem, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId }) =>
      modelingService.addModelEnumerationItem({ type: ModelingCommandType.AddModelEnumerationItem, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { addModelEnumerationItem, isPending };
}

export function useRemoveModelEnumerationItem() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeModelEnumerationItem, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; enumerationItemId: EnumerationItemId }) =>
      modelingService.removeModelEnumerationItem({
        type: ModelingCommandType.RemoveModelEnumerationItem,
        ...params,
      }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { removeModelEnumerationItem, isPending };
}

export function useRemoveAllModelEnumerationItems() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: removeAllModelEnumerationItems, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId }) =>
      modelingService.removeAllModelEnumerationItems({
        type: ModelingCommandType.RemoveAllModelEnumerationItems,
        ...params,
      }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { removeAllModelEnumerationItems, isPending };
}

export function useRenameModelEnumerationItem() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: renameModelEnumerationItem, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; enumerationItemId: EnumerationItemId; name: string; language: Language }) =>
      modelingService.renameModelEnumerationItem({
        type: ModelingCommandType.RenameModelEnumerationItem,
        ...params,
      }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { renameModelEnumerationItem, isPending };
}

export function useEditModelEnumerationItemCode() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelEnumerationItemCode, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; enumerationItemId: EnumerationItemId; code: string }) =>
      modelingService.editModelEnumerationItemCode({
        type: ModelingCommandType.EditModelEnumerationItemCode,
        ...params,
      }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    },
  });

  return { editModelEnumerationItemCode, isPending };
}
