import { ModelingCommandType } from '@/models/modeling/messages/commands';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, ModuleId, ProjectId, Stereotype } from '@/models/modeling/values';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModelingService } from './modeling-service';

function invalidateModel(queryClient: ReturnType<typeof useQueryClient>, modelId: ModelId, projectId: string | null) {
  queryClient.invalidateQueries({ queryKey: ['model', modelId] });
  if (projectId) {
    queryClient.invalidateQueries({ queryKey: ['models', `?projectId=${projectId}`] });
  }
}

export function useAddModel() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: addModel, isPending } = useMutation({
    mutationFn: (params: { projectId: ProjectId; moduleId: ModuleId; name: string; language: Language; }) => modelingService.addModel({ type: ModelingCommandType.AddModel, ...params }),
    onSuccess: (model) => {
      queryClient.invalidateQueries({ queryKey: ['models', `?projectId=${model.projectId}`] });
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
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { renameModel, isPending };
}

export function useEditModelStereotype() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelStereotype, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; stereotype: Stereotype }) =>
      modelingService.editModelStereotype({ type: ModelingCommandType.EditModelStereotype, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { editModelStereotype, isPending };
}

export function useEditModelGeneralizationType() {
  const modelingService = useModelingService();
  const queryClient = useQueryClient();

  const { mutateAsync: editModelGeneralizationType, isPending } = useMutation({
    mutationFn: (params: { modelId: ModelId; generalizationType: TypeReference | null }) =>
      modelingService.editModelGeneralizationType({ type: ModelingCommandType.EditModelGeneralizationType, ...params }),
    onSuccess: (model) => invalidateModel(queryClient, model.id, model.projectId),
  });

  return { editModelGeneralizationType, isPending };
}