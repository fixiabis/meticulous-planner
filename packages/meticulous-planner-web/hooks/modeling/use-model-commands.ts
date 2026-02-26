import {
  useAddModelAttribute,
  useEditModelAttributeMultiplicity,
  useEditModelAttributeType,
  useRemoveAllModelAttributes,
  useRemoveModelAttribute,
  useRenameModelAttribute,
} from './model-attribute-commands';
import {
  useEditModelGeneralizationType,
  useEditModelStereotype,
  useMoveModelToService,
  useRenameModel,
} from './model-commands';
import {
  useAddModelTypeParameter,
  useEditModelTypeParameterConstraintType,
  useRemoveAllModelTypeParameters,
  useRemoveModelTypeParameter,
  useRenameModelTypeParameter,
} from './model-type-parameter-commands';
import {
  useAddModelOperation,
  useAddModelOperationParameter,
  useEditModelOperationMultiplicity,
  useEditModelOperationParameterMultiplicity,
  useEditModelOperationParameterType,
  useEditModelOperationReturnType,
  useRemoveAllModelOperationParameters,
  useRemoveAllModelOperations,
  useRemoveModelOperation,
  useRemoveModelOperationParameter,
  useRenameModelOperation,
  useRenameModelOperationParameter,
} from './model-operation-commands';
import {
  useAddModelEnumerationItem,
  useEditModelEnumerationItemCode,
  useRemoveAllModelEnumerationItems,
  useRemoveModelEnumerationItem,
  useRenameModelEnumerationItem,
} from './model-enumeration-item-commands';

export function useModelCommands() {
  const { renameModel } = useRenameModel();
  const { editModelStereotype } = useEditModelStereotype();
  const { editModelGeneralizationType } = useEditModelGeneralizationType();
  const { moveModelToService } = useMoveModelToService();
  const { addModelTypeParameter } = useAddModelTypeParameter();
  const { removeModelTypeParameter } = useRemoveModelTypeParameter();
  const { removeAllModelTypeParameters } = useRemoveAllModelTypeParameters();
  const { renameModelTypeParameter } = useRenameModelTypeParameter();
  const { editModelTypeParameterConstraintType } = useEditModelTypeParameterConstraintType();
  const { addModelAttribute } = useAddModelAttribute();
  const { removeModelAttribute } = useRemoveModelAttribute();
  const { removeAllModelAttributes } = useRemoveAllModelAttributes();
  const { renameModelAttribute } = useRenameModelAttribute();
  const { editModelAttributeType } = useEditModelAttributeType();
  const { editModelAttributeMultiplicity } = useEditModelAttributeMultiplicity();
  const { addModelOperation } = useAddModelOperation();
  const { removeModelOperation } = useRemoveModelOperation();
  const { removeAllModelOperations } = useRemoveAllModelOperations();
  const { renameModelOperation } = useRenameModelOperation();
  const { editModelOperationReturnType } = useEditModelOperationReturnType();
  const { editModelOperationMultiplicity } = useEditModelOperationMultiplicity();
  const { addModelOperationParameter } = useAddModelOperationParameter();
  const { removeModelOperationParameter } = useRemoveModelOperationParameter();
  const { removeAllModelOperationParameters } = useRemoveAllModelOperationParameters();
  const { renameModelOperationParameter } = useRenameModelOperationParameter();
  const { editModelOperationParameterType } = useEditModelOperationParameterType();
  const { editModelOperationParameterMultiplicity } = useEditModelOperationParameterMultiplicity();
  const { addModelEnumerationItem } = useAddModelEnumerationItem();
  const { removeModelEnumerationItem } = useRemoveModelEnumerationItem();
  const { removeAllModelEnumerationItems } = useRemoveAllModelEnumerationItems();
  const { renameModelEnumerationItem } = useRenameModelEnumerationItem();
  const { editModelEnumerationItemCode } = useEditModelEnumerationItemCode();

  return {
    renameModel,
    editModelStereotype,
    editModelGeneralizationType,
    moveModelToService,
    addModelTypeParameter,
    removeModelTypeParameter,
    removeAllModelTypeParameters,
    renameModelTypeParameter,
    editModelTypeParameterConstraintType,
    addModelAttribute,
    removeModelAttribute,
    removeAllModelAttributes,
    renameModelAttribute,
    editModelAttributeType,
    editModelAttributeMultiplicity,
    addModelOperation,
    removeModelOperation,
    removeAllModelOperations,
    renameModelOperation,
    editModelOperationReturnType,
    editModelOperationMultiplicity,
    addModelOperationParameter,
    removeModelOperationParameter,
    removeAllModelOperationParameters,
    renameModelOperationParameter,
    editModelOperationParameterType,
    editModelOperationParameterMultiplicity,
    addModelEnumerationItem,
    removeModelEnumerationItem,
    removeAllModelEnumerationItems,
    renameModelEnumerationItem,
    editModelEnumerationItemCode,
  };
}

export type ModelCommands = ReturnType<typeof useModelCommands>;
