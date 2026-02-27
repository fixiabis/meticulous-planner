'use client';

import { ContentEditable } from '@/components/base/content-editable';
import { DropdownMenu } from '@/components/base/dropdown-menu';
import { Select } from '@/components/base/select';
import { ServiceSelector } from '@/components/modeling/blocks/service-selector';
import { TypeReferenceInput } from '@/components/modeling/blocks/type-reference-input';
import { MultiplicitySelect } from '@/components/modeling/elements/multiplicity-select';
import { StereotypeSelect } from '@/components/modeling/elements/stereotype-select';
import { ModelCommands } from '@/hooks/modeling/use-model-commands';
import { cn } from '@/lib/utils';
import { Model } from '@/models/modeling/model';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, OperationStereotype, Stereotype } from '@/models/modeling/values';

export type ModelChineseViewProps = {
  modelId: ModelId;
  model: Model;
  commands: ModelCommands;
};

export function ModelChineseView({ modelId, model, commands }: ModelChineseViewProps) {
  const lang = Language.Chinese;

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold mb-2">
        <ContentEditable
          className={cn({ 'inline-block min-w-24': !model.descriptions[lang]?.name })}
          content={model.descriptions[lang]?.name || ''}
          placeholder="模型名稱"
          onContentChange={(name) => {
            if (name.trim() !== '') {
              commands.renameModel({ modelId, name, language: lang });
            }
          }}
        />
      </h1>
      <p>
        是
        <ServiceSelector
          systemId={model.systemId}
          language={lang}
          value={model.serviceId}
          onChange={(serviceId) => commands.moveModelToService({ modelId, serviceId })}
        />
        中的
        <StereotypeSelect
          language={lang}
          value={model.stereotype}
          onChange={(stereotype) => commands.editModelStereotype({ modelId, stereotype })}
        />
        ，
        <Select
          value={model.generalizationType !== null}
          onChange={(hasGeneralization) => {
            commands.editModelGeneralizationType({
              modelId,
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
            language={lang}
            onChange={(generalizationType) => {
              commands.editModelGeneralizationType({ modelId, generalizationType });
            }}
          />
        )}
        ，
        <Select
          value={model.typeParameters.length > 0}
          onChange={(hasTypeParameter) => {
            if (hasTypeParameter) {
              commands.addModelTypeParameter({ modelId });
            } else {
              commands.removeAllModelTypeParameters({ modelId });
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
            items={[{ label: '新增模型資訊', onSelect: () => commands.addModelTypeParameter({ modelId }) }]}
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
                className={cn({ 'inline-block min-w-24': !typeParameter.descriptions[lang]?.name })}
                content={typeParameter.descriptions[lang]?.name || ''}
                placeholder="模型資訊名稱"
                onContentChange={(name) =>
                  commands.renameModelTypeParameter({
                    modelId,
                    typeParameterId: typeParameter.id,
                    name,
                    language: lang,
                  })
                }
              />
              ：
              <Select
                value={typeParameter.constraintType !== null}
                onChange={(hasConstraintType) => {
                  commands.editModelTypeParameterConstraintType({
                    modelId,
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
                  language={lang}
                  onChange={(constraintType) =>
                    commands.editModelTypeParameterConstraintType({
                      modelId,
                      typeParameterId: typeParameter.id,
                      constraintType,
                    })
                  }
                />
              )}
              <DropdownMenu
                items={[
                  { label: '新增模型資訊', onSelect: () => commands.addModelTypeParameter({ modelId }) },
                  {
                    label: '移除模型資訊',
                    onSelect: () => commands.removeModelTypeParameter({ modelId, typeParameterId: typeParameter.id }),
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
                commands.addModelAttribute({ modelId });
              } else {
                commands.removeAllModelAttributes({ modelId });
              }
            }}
            items={[
              { label: '暫無任何資訊', value: false },
              { label: '包含以下資訊：', value: true },
            ]}
          />
          <DropdownMenu items={[{ label: '新增資訊', onSelect: () => commands.addModelAttribute({ modelId }) }]}>
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
                className={cn({ 'inline-block min-w-16': !attribute.descriptions[lang]?.name })}
                content={attribute.descriptions[lang]?.name || ''}
                placeholder="資訊名稱"
                onContentChange={(name) =>
                  commands.renameModelAttribute({ modelId, attributeId: attribute.id, name, language: lang })
                }
              />
              ：是
              <MultiplicitySelect
                language={lang}
                value={attribute.multiplicity}
                onChange={(multiplicity) =>
                  commands.editModelAttributeMultiplicity({ modelId, attributeId: attribute.id, multiplicity })
                }
              />
              <TypeReferenceInput
                value={attribute.type}
                typeParameterModelId={model.id}
                language={lang}
                onChange={(type) =>
                  commands.editModelAttributeType({ modelId, attributeId: attribute.id, attributeType: type })
                }
              />
              <DropdownMenu
                items={[
                  { label: '新增資訊', onSelect: () => commands.addModelAttribute({ modelId }) },
                  {
                    label: '移除資訊',
                    onSelect: () => commands.removeModelAttribute({ modelId, attributeId: attribute.id }),
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
      {model.stereotype !== Stereotype.Enumeration &&
        (() => {
          const commandOps = model.operations.filter((op) => op.stereotype === OperationStereotype.Command);
          const queryOps = model.operations.filter((op) => op.stereotype === OperationStereotype.Query);

          function renderOperationSection(
            ops: typeof model.operations,
            stereotype: OperationStereotype,
            groupKey: string,
            emptyLabel: string,
            hasLabel: string,
            actionWord: string,
            addLabel: string,
            removeLabel: string,
            addParamLabel: string,
            removeParamLabel: string,
          ) {
            return (
              <>
                <p className={`group/${groupKey}`}>
                  <Select
                    value={ops.length > 0}
                    onChange={(has) => {
                      if (has) {
                        commands.addModelOperation({ modelId, stereotype });
                      } else {
                        commands.removeAllModelOperations({ modelId, stereotype });
                      }
                    }}
                    items={[
                      { label: emptyLabel, value: false },
                      { label: hasLabel, value: true },
                    ]}
                  />
                  <DropdownMenu
                    items={[{ label: addLabel, onSelect: () => commands.addModelOperation({ modelId, stereotype }) }]}
                  >
                    <span
                      className={`cursor-pointer text-muted-foreground opacity-0 group-hover/${groupKey}:opacity-100`}
                    >
                      {' '}
                      ...
                    </span>
                  </DropdownMenu>
                </p>
                {ops.length > 0 && (
                  <ul className="list-disc list-outside pl-6">
                    {ops.map((operation) => (
                      <li key={operation.id}>
                        <p className="relative group/operation">
                          <ContentEditable
                            className={cn({ 'inline-block min-w-16': !operation.descriptions[lang]?.name })}
                            content={operation.descriptions[lang]?.name || ''}
                            placeholder="操作名稱"
                            onContentChange={(name) =>
                              commands.renameModelOperation({
                                modelId,
                                operationId: operation.id,
                                name,
                                language: lang,
                              })
                            }
                          />
                          ，{actionWord}
                          <Select
                            value={operation.returnType !== null}
                            items={[
                              { label: '不會得到任何資訊', value: false },
                              { label: '會得到' + (operation.returnType ? '' : '...'), value: true },
                            ]}
                            onChange={(value) => {
                              commands.editModelOperationReturnType({
                                modelId,
                                operationId: operation.id,
                                returnType: value === false ? null : TypeReference.createModel(null),
                              });
                            }}
                          />
                          {operation.returnType && (
                            <MultiplicitySelect
                              language={lang}
                              value={operation.returnMultiplicity}
                              onChange={(multiplicity) =>
                                commands.editModelOperationMultiplicity({
                                  modelId,
                                  operationId: operation.id,
                                  multiplicity,
                                })
                              }
                            />
                          )}
                          {operation.returnType && (
                            <TypeReferenceInput
                              value={operation.returnType}
                              typeParameterModelId={model.id}
                              language={lang}
                              onChange={(returnType) => {
                                if (returnType !== null) {
                                  commands.editModelOperationReturnType({
                                    modelId,
                                    operationId: operation.id,
                                    returnType,
                                  });
                                }
                              }}
                            />
                          )}
                          ，
                          <Select
                            value={operation.parameters.length > 0}
                            onChange={(hasParameter) => {
                              if (hasParameter) {
                                commands.addModelOperationParameter({ modelId, operationId: operation.id });
                              } else {
                                commands.removeAllModelOperationParameters({ modelId, operationId: operation.id });
                              }
                            }}
                            items={[
                              { label: '無需提供任何資訊', value: false },
                              { label: '需提供以下資訊：', value: true },
                            ]}
                          />
                          <DropdownMenu
                            items={[
                              { label: addLabel, onSelect: () => commands.addModelOperation({ modelId, stereotype }) },
                              {
                                label: removeLabel,
                                onSelect: () => commands.removeModelOperation({ modelId, operationId: operation.id }),
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
                                  className={cn({ 'inline-block min-w-16': !parameter.descriptions[lang]?.name })}
                                  content={parameter.descriptions[lang]?.name || ''}
                                  placeholder="資訊名稱"
                                  onContentChange={(name) =>
                                    commands.renameModelOperationParameter({
                                      modelId,
                                      operationId: operation.id,
                                      parameterId: parameter.id,
                                      name,
                                      language: lang,
                                    })
                                  }
                                />
                                ：是
                                <MultiplicitySelect
                                  language={lang}
                                  value={parameter.multiplicity}
                                  onChange={(multiplicity) =>
                                    commands.editModelOperationParameterMultiplicity({
                                      modelId,
                                      operationId: operation.id,
                                      parameterId: parameter.id,
                                      multiplicity,
                                    })
                                  }
                                />
                                <TypeReferenceInput
                                  value={parameter.type}
                                  typeParameterModelId={model.id}
                                  language={lang}
                                  onChange={(parameterType) => {
                                    if (parameterType !== null) {
                                      commands.editModelOperationParameterType({
                                        modelId,
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
                                      label: addParamLabel,
                                      onSelect: () =>
                                        commands.addModelOperationParameter({ modelId, operationId: operation.id }),
                                    },
                                    {
                                      label: removeParamLabel,
                                      onSelect: () =>
                                        commands.removeModelOperationParameter({
                                          modelId,
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
                      </li>
                    ))}
                  </ul>
                )}
              </>
            );
          }

          return (
            <>
              {renderOperationSection(
                commandOps,
                OperationStereotype.Command,
                'commands',
                '暫無法對其下達任何指示',
                '能對其下達以下指示：',
                '指示後',
                '新增指示',
                '移除指示',
                '新增指示所需資訊',
                '移除指示所需資訊',
              )}
              {renderOperationSection(
                queryOps,
                OperationStereotype.Query,
                'queries',
                '暫無法向其提出任何詢問',
                '能向其提出以下詢問：',
                '詢問後',
                '新增詢問',
                '移除詢問',
                '新增詢問所需資訊',
                '移除詢問所需資訊',
              )}
            </>
          );
        })()}
      {model.stereotype === Stereotype.Enumeration && (
        <p className="group/enumeration-items">
          <Select
            value={model.enumerationItems.length > 0}
            onChange={(hasEnumerationItem) => {
              if (hasEnumerationItem) {
                commands.addModelEnumerationItem({ modelId });
              } else {
                commands.removeAllModelEnumerationItems({ modelId });
              }
            }}
            items={[
              { label: '暫無任何種類', value: false },
              { label: '分為以下種類：', value: true },
            ]}
          />
          <DropdownMenu items={[{ label: '新增種類', onSelect: () => commands.addModelEnumerationItem({ modelId }) }]}>
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
                className={cn({ 'inline-block min-w-16': !enumerationItem.descriptions[lang]?.name })}
                content={enumerationItem.descriptions[lang]?.name || ''}
                placeholder="種類名稱"
                onContentChange={(name) =>
                  commands.renameModelEnumerationItem({
                    modelId,
                    enumerationItemId: enumerationItem.id,
                    name,
                    language: lang,
                  })
                }
              />
              ：使用代號「
              <ContentEditable
                className={cn({ 'inline-block min-w-8': !enumerationItem.code })}
                content={enumerationItem.code}
                placeholder="代號"
                onContentChange={(code) =>
                  commands.editModelEnumerationItemCode({ modelId, enumerationItemId: enumerationItem.id, code })
                }
              />
              」
              <DropdownMenu
                items={[
                  { label: '新增種類', onSelect: () => commands.addModelEnumerationItem({ modelId }) },
                  {
                    label: '移除種類',
                    onSelect: () =>
                      commands.removeModelEnumerationItem({ modelId, enumerationItemId: enumerationItem.id }),
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
