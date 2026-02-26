import { ContentEditable } from '@/components/base/content-editable';
import { DropdownMenu } from '@/components/base/dropdown-menu';
import { Select } from '@/components/base/select';
import {
  useAddModelAttribute,
  useEditModelAttributeMultiplicity,
  useEditModelAttributeType,
  useRemoveAllModelAttributes,
  useRemoveModelAttribute,
  useRenameModelAttribute,
} from '@/hooks/modeling/model-attribute-commands';
import {
  useEditModelGeneralizationType,
  useEditModelStereotype,
  useMoveModelToService,
  useRenameModel,
} from '@/hooks/modeling/model-commands';
import {
  useAddModelTypeParameter,
  useEditModelTypeParameterConstraintType,
  useRemoveAllModelTypeParameters,
  useRemoveModelTypeParameter,
  useRenameModelTypeParameter,
} from '@/hooks/modeling/model-type-parameter-commands';
import { useModel } from '@/hooks/modeling/queries';
import { cn } from '@/lib/utils';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, Stereotype } from '@/models/modeling/values';
import { StereotypeSelect } from '../elements/stereotype-select';
import { ServiceSelector } from './service-selector';
import { TypeReferenceInput } from './type-reference-input';
import { MultiplicitySelect } from '../elements/multiplicity-select';
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
} from '@/hooks/modeling/model-operation-commands';
import {
  useAddModelEnumerationItem,
  useEditModelEnumerationItemCode,
  useRemoveAllModelEnumerationItems,
  useRemoveModelEnumerationItem,
  useRenameModelEnumerationItem,
} from '@/hooks/modeling/model-enumeration-item-commands';

export type ModelEditorProps = {
  className?: string;
  modelId: ModelId;
};

export function ModelEditor(props: ModelEditorProps) {
  const { model } = useModel(props.modelId);
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

  if (!model) {
    return <div className={cn('p-4 space-y-1', props.className)}></div>;
  }

  const name = (
    <ContentEditable
      className={cn({ 'inline-block min-w-24': !model.descriptions[Language.Chinese]?.name })}
      content={model.descriptions[Language.Chinese]?.name || ''}
      placeholder="模型名稱"
      onContentChange={(name) => {
        if (name.trim() !== '') {
          renameModel({ modelId: props.modelId, name, language: Language.Chinese });
        }
      }}
    />
  );

  return (
    <div className={cn('p-4 space-y-1', props.className)}>
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <p>
        是
        <ServiceSelector
          systemId={model.systemId}
          language={Language.Chinese}
          value={model.serviceId}
          onChange={(serviceId) => moveModelToService({ modelId: props.modelId, serviceId })}
        />
        中的
        <StereotypeSelect
          language={Language.Chinese}
          value={model.stereotype}
          onChange={(stereotype) => editModelStereotype({ modelId: props.modelId, stereotype })}
        />
        ，
        <Select
          value={model.generalizationType !== null}
          onChange={(hasGeneralization) => {
            editModelGeneralizationType({
              modelId: props.modelId,
              generalizationType: hasGeneralization ? TypeReference.createModel(null) : null,
            });
          }}
          items={[
            { label: '是基本概念', value: false },
            { label: '是一種' + (model.generalizationType ? '' : '...'), value: true },
          ]}
        />
        {model.generalizationType && (
          <TypeReferenceInput
            value={model.generalizationType}
            typeParameterModelId={model.id}
            language={Language.Chinese}
            onChange={(generalizationType) => {
              editModelGeneralizationType({
                modelId: props.modelId,
                generalizationType,
              });
            }}
          />
        )}
        ，
        <Select
          value={model.typeParameters.length > 0}
          onChange={(hasTypeParameter) => {
            if (hasTypeParameter) {
              addModelTypeParameter({ modelId: props.modelId });
            } else {
              removeAllModelTypeParameters({ modelId: props.modelId });
            }
          }}
          items={[
            { label: '用途明確', value: false },
            { label: '用途廣泛', value: true },
          ]}
        />
      </p>
      {model.typeParameters.length > 0 && (
        <p className="group/type-parameters">
          由於用途廣泛，使用時需要以下模型資訊：
          <DropdownMenu
            items={[{ label: '新增模型資訊', onSelect: () => addModelTypeParameter({ modelId: props.modelId }) }]}
          >
            <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/type-parameters:opacity-100">
              {' '}
              ...
            </span>
          </DropdownMenu>
        </p>
      )}
      {model.typeParameters.length > 0 && (
        <ul className="list-disc list-outside pl-6">
          {model.typeParameters.map((typeParameter) => (
            <li key={typeParameter.id} className="relative group/type-parameter">
              <ContentEditable
                className={cn({ 'inline-block min-w-24': !typeParameter.descriptions[Language.Chinese]?.name })}
                content={typeParameter.descriptions[Language.Chinese]?.name || ''}
                placeholder="模型資訊名稱"
                onContentChange={(name) =>
                  renameModelTypeParameter({
                    modelId: props.modelId,
                    typeParameterId: typeParameter.id,
                    name,
                    language: Language.Chinese,
                  })
                }
              />
              ：
              <Select
                value={typeParameter.constraintType !== null}
                onChange={(hasConstraintType) => {
                  editModelTypeParameterConstraintType({
                    modelId: props.modelId,
                    typeParameterId: typeParameter.id,
                    constraintType: hasConstraintType ? TypeReference.createModel(null) : null,
                  });
                }}
                items={[
                  { label: '可以是任意模型', value: false },
                  { label: '只能是' + (typeParameter.constraintType ? '' : '...'), value: true },
                ]}
              />
              {typeParameter.constraintType !== null && (
                <TypeReferenceInput
                  value={typeParameter.constraintType}
                  typeParameterModelId={model.id}
                  language={Language.Chinese}
                  onChange={(constraintType) =>
                    editModelTypeParameterConstraintType({
                      modelId: props.modelId,
                      typeParameterId: typeParameter.id,
                      constraintType,
                    })
                  }
                />
              )}
              <DropdownMenu
                items={[
                  { label: '新增模型資訊', onSelect: () => addModelTypeParameter({ modelId: props.modelId }) },
                  {
                    label: '移除模型資訊',
                    onSelect: () =>
                      removeModelTypeParameter({ modelId: props.modelId, typeParameterId: typeParameter.id }),
                  },
                ]}
              >
                <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/type-parameter:opacity-100">
                  {' '}
                  ...
                </span>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
      {model.stereotype !== Stereotype.Enumeration && (
        <p className="group/attributes">
          <Select
            value={model.attributes.length > 0}
            onChange={(hasAttribute) => {
              if (hasAttribute) {
                addModelAttribute({ modelId: props.modelId });
              } else {
                removeAllModelAttributes({ modelId: props.modelId });
              }
            }}
            items={[
              { label: '暫無任何資訊', value: false },
              { label: '包含以下資訊：', value: true },
            ]}
          />
          <DropdownMenu items={[{ label: '新增資訊', onSelect: () => addModelAttribute({ modelId: props.modelId }) }]}>
            <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/attributes:opacity-100">
              {' '}
              ...
            </span>
          </DropdownMenu>
        </p>
      )}
      {model.attributes.length > 0 && (
        <ul className="list-disc list-outside pl-6">
          {model.attributes.map((attribute) => (
            <li key={attribute.id} className="relative group/attribute">
              <ContentEditable
                className={cn({ 'inline-block min-w-16': !attribute.descriptions[Language.Chinese]?.name })}
                content={attribute.descriptions[Language.Chinese]?.name || ''}
                placeholder="資訊名稱"
                onContentChange={(name) =>
                  renameModelAttribute({
                    modelId: props.modelId,
                    attributeId: attribute.id,
                    name,
                    language: Language.Chinese,
                  })
                }
              />
              ：是
              <MultiplicitySelect
                language={Language.Chinese}
                value={attribute.multiplicity}
                onChange={(multiplicity) =>
                  editModelAttributeMultiplicity({
                    modelId: props.modelId,
                    attributeId: attribute.id,
                    multiplicity,
                  })
                }
              />
              <TypeReferenceInput
                value={attribute.type}
                typeParameterModelId={model.id}
                language={Language.Chinese}
                onChange={(type) =>
                  editModelAttributeType({
                    modelId: props.modelId,
                    attributeId: attribute.id,
                    attributeType: type,
                  })
                }
              />
              <DropdownMenu
                items={[
                  { label: '新增資訊', onSelect: () => addModelAttribute({ modelId: props.modelId }) },
                  {
                    label: '移除資訊',
                    onSelect: () => removeModelAttribute({ modelId: props.modelId, attributeId: attribute.id }),
                  },
                ]}
              >
                <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/attribute:opacity-100">
                  {' '}
                  ...
                </span>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
      {model.stereotype !== Stereotype.Enumeration && (
        <p className="group/operations">
          <Select
            value={model.operations.length > 0}
            onChange={(hasOperation) => {
              if (hasOperation) {
                addModelOperation({ modelId: props.modelId });
              } else {
                removeAllModelOperations({ modelId: props.modelId });
              }
            }}
            items={[
              {
                label: '暫無法' + (model.stereotype === Stereotype.ExternalSystem ? '請' : '對') + '其進行任何操作',
                value: false,
              },
              {
                label: '能' + (model.stereotype === Stereotype.ExternalSystem ? '請' : '對') + '其進行以下操作：',
                value: true,
              },
            ]}
          />
          <DropdownMenu items={[{ label: '新增操作', onSelect: () => addModelOperation({ modelId: props.modelId }) }]}>
            <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/operations:opacity-100">
              {' '}
              ...
            </span>
          </DropdownMenu>
        </p>
      )}
      {model.operations.length > 0 && (
        <ul className="list-disc list-outside pl-6">
          {model.operations.map((operation) => (
            <li key={operation.id}>
              <p className="relative group/operation">
                <ContentEditable
                  className={cn({ 'inline-block min-w-16': !operation.descriptions[Language.Chinese]?.name })}
                  content={operation.descriptions[Language.Chinese]?.name || ''}
                  placeholder="操作名稱"
                  onContentChange={(name) =>
                    renameModelOperation({
                      modelId: props.modelId,
                      operationId: operation.id,
                      name,
                      language: Language.Chinese,
                    })
                  }
                />
                ，操作後
                <Select
                  value={operation.returnType !== null}
                  items={[
                    { label: '不會得到任何資訊', value: false },
                    { label: '會得到' + (operation.returnType ? '' : '...'), value: true },
                  ]}
                  onChange={(value) => {
                    editModelOperationReturnType({
                      modelId: props.modelId,
                      operationId: operation.id,
                      returnType: value === false ? null : TypeReference.createModel(null),
                    });
                  }}
                ></Select>
                <MultiplicitySelect
                  language={Language.Chinese}
                  value={operation.returnMultiplicity}
                  onChange={(multiplicity) =>
                    editModelOperationMultiplicity({ modelId: props.modelId, operationId: operation.id, multiplicity })
                  }
                />
                <TypeReferenceInput
                  value={operation.returnType}
                  typeParameterModelId={model.id}
                  language={Language.Chinese}
                  onChange={(returnType) => {
                    if (returnType !== null) {
                      editModelOperationReturnType({ modelId: props.modelId, operationId: operation.id, returnType });
                    }
                  }}
                />
                ，
                <Select
                  value={operation.parameters.length > 0}
                  onChange={(hasParameter) => {
                    if (hasParameter) {
                      addModelOperationParameter({ modelId: props.modelId, operationId: operation.id });
                    } else {
                      removeAllModelOperationParameters({ modelId: props.modelId, operationId: operation.id });
                    }
                  }}
                  items={[
                    { label: '無需提供任何資訊', value: false },
                    { label: '需提供以下資訊：', value: true },
                  ]}
                />
                <DropdownMenu
                  items={[
                    { label: '新增操作', onSelect: () => addModelOperation({ modelId: props.modelId }) },
                    {
                      label: '移除操作',
                      onSelect: () => removeModelOperation({ modelId: props.modelId, operationId: operation.id }),
                    },
                  ]}
                >
                  <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/operation:opacity-100">
                    {' '}
                    ...
                  </span>
                </DropdownMenu>
              </p>
              {operation.parameters.length > 0 && (
                <ul className="list-[circle] list-outside pl-6">
                  {operation.parameters.map((parameter) => (
                    <li key={parameter.id} className="relative group/parameter">
                      <ContentEditable
                        className={cn({ 'inline-block min-w-16': !parameter.descriptions[Language.Chinese]?.name })}
                        content={parameter.descriptions[Language.Chinese]?.name || ''}
                        placeholder="資訊名稱"
                        onContentChange={(name) =>
                          renameModelOperationParameter({
                            modelId: props.modelId,
                            operationId: operation.id,
                            parameterId: parameter.id,
                            name,
                            language: Language.Chinese,
                          })
                        }
                      />
                      ：是
                      <MultiplicitySelect
                        language={Language.Chinese}
                        value={parameter.multiplicity}
                        onChange={(multiplicity) =>
                          editModelOperationParameterMultiplicity({
                            modelId: props.modelId,
                            operationId: operation.id,
                            parameterId: parameter.id,
                            multiplicity,
                          })
                        }
                      />
                      <TypeReferenceInput
                        value={parameter.type}
                        typeParameterModelId={model.id}
                        language={Language.Chinese}
                        onChange={(parameterType) => {
                          if (parameterType !== null) {
                            editModelOperationParameterType({
                              modelId: props.modelId,
                              operationId: operation.id,
                              parameterId: parameter.id,
                              parameterType,
                            });
                          }
                        }}
                      />
                      <DropdownMenu
                        contentClassName="w-36"
                        items={[
                          {
                            label: '新增操作所需資訊',
                            onSelect: () =>
                              addModelOperationParameter({ modelId: props.modelId, operationId: operation.id }),
                          },
                          {
                            label: '移除操作所需資訊',
                            onSelect: () =>
                              removeModelOperationParameter({
                                modelId: props.modelId,
                                operationId: operation.id,
                                parameterId: parameter.id,
                              }),
                          },
                        ]}
                      >
                        <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/parameter:opacity-100">
                          {' '}
                          ...
                        </span>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              )}
              <p>
                <Select
                  value={true}
                  onChange={(hasRule) => {
                    if (hasRule) {
                      console.log('TODO: show operation rule editor');
                    } else {
                    }
                  }}
                  items={[
                    { label: '操作時，暫無任何限制', value: false },
                    { label: '操作時，需要符合以下規則：', value: true },
                  ]}
                />
              </p>
              <p>
                <Select
                  value={true}
                  onChange={(hasEffect) => {
                    if (hasEffect) {
                      console.log('TODO: show operation effect editor');
                    } else {
                    }
                  }}
                  items={[
                    { label: '操作後，暫不會使其造成任何改變', value: false },
                    { label: '操作後，會使其產生以下改變：', value: true },
                  ]}
                />
              </p>
            </li>
          ))}
        </ul>
      )}
      {model.stereotype === Stereotype.Enumeration && (
        <p className="group/enumeration-items">
          <Select
            value={model.enumerationItems.length > 0}
            onChange={(hasEnumerationItem) => {
              if (hasEnumerationItem) {
                addModelEnumerationItem({ modelId: props.modelId });
              } else {
                removeAllModelEnumerationItems({ modelId: props.modelId });
              }
            }}
            items={[
              { label: '暫無任何種類', value: false },
              { label: '分為以下種類：', value: true },
            ]}
          />
          <DropdownMenu
            items={[{ label: '新增種類', onSelect: () => addModelEnumerationItem({ modelId: props.modelId }) }]}
          >
            <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/enumeration-items:opacity-100">
              {' '}
              ...
            </span>
          </DropdownMenu>
        </p>
      )}
      {model.stereotype === Stereotype.Enumeration && model.enumerationItems.length > 0 && (
        <ul className="list-disc list-outside pl-6">
          {model.enumerationItems.map((enumerationItem) => (
            <li key={enumerationItem.id} className="relative group/enumeration-item">
              <ContentEditable
                className={cn({ 'inline-block min-w-16': !enumerationItem.descriptions[Language.Chinese]?.name })}
                content={enumerationItem.descriptions[Language.Chinese]?.name || ''}
                placeholder="種類名稱"
                onContentChange={(name) =>
                  renameModelEnumerationItem({
                    modelId: props.modelId,
                    enumerationItemId: enumerationItem.id,
                    name,
                    language: Language.Chinese,
                  })
                }
              />
              ：使用代號「
              <ContentEditable
                className={cn({ 'inline-block min-w-8': !enumerationItem.code })}
                content={enumerationItem.code}
                placeholder="代號"
                onContentChange={(code) =>
                  editModelEnumerationItemCode({
                    modelId: props.modelId,
                    enumerationItemId: enumerationItem.id,
                    code,
                  })
                }
              />
              」
              <DropdownMenu
                items={[
                  { label: '新增種類', onSelect: () => addModelEnumerationItem({ modelId: props.modelId }) },
                  {
                    label: '移除種類',
                    onSelect: () =>
                      removeModelEnumerationItem({
                        modelId: props.modelId,
                        enumerationItemId: enumerationItem.id,
                      }),
                  },
                ]}
              >
                <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/enumeration-item:opacity-100">
                  {' '}
                  ...
                </span>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
