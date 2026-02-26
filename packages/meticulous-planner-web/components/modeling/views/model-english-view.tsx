'use client';

import { ContentEditable } from '@/components/base/content-editable';
import { DropdownMenu } from '@/components/base/dropdown-menu';
import { Select } from '@/components/base/select';
import { ServiceSelector } from '@/components/modeling/blocks/service-selector';
import { TypeReferenceInput } from '@/components/modeling/blocks/type-reference-input';
import { MultiplicitySelect } from '@/components/modeling/elements/multiplicity-select';
import { StereotypeSelect } from '@/components/modeling/elements/stereotype-select';
import { ModelCommands } from '@/hooks/modeling/use-model-commands';
import { toTechnicalName } from '@/lib/naming';
import { cn } from '@/lib/utils';
import { Model } from '@/models/modeling/model';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, Stereotype } from '@/models/modeling/values';

export type ModelEnglishViewProps = {
  modelId: ModelId;
  model: Model;
  commands: ModelCommands;
};

/** Calls renameXxx for both Language.English and auto-derived Language.Technical. */
function useEnglishRename(commands: ModelCommands) {
  function renameModel(params: Omit<Parameters<ModelCommands['renameModel']>[0], 'language'>) {
    commands.renameModel({ ...params, language: Language.English });
    commands.renameModel({ ...params, name: toTechnicalName(params.name), language: Language.Technical });
  }
  function renameAttribute(params: Omit<Parameters<ModelCommands['renameModelAttribute']>[0], 'language'>) {
    commands.renameModelAttribute({ ...params, language: Language.English });
    commands.renameModelAttribute({ ...params, name: toTechnicalName(params.name), language: Language.Technical });
  }
  function renameOperation(params: Omit<Parameters<ModelCommands['renameModelOperation']>[0], 'language'>) {
    commands.renameModelOperation({ ...params, language: Language.English });
    commands.renameModelOperation({ ...params, name: toTechnicalName(params.name), language: Language.Technical });
  }
  function renameParameter(params: Omit<Parameters<ModelCommands['renameModelOperationParameter']>[0], 'language'>) {
    commands.renameModelOperationParameter({ ...params, language: Language.English });
    commands.renameModelOperationParameter({ ...params, name: toTechnicalName(params.name), language: Language.Technical });
  }
  function renameTypeParameter(params: Omit<Parameters<ModelCommands['renameModelTypeParameter']>[0], 'language'>) {
    commands.renameModelTypeParameter({ ...params, language: Language.English });
    commands.renameModelTypeParameter({ ...params, name: toTechnicalName(params.name), language: Language.Technical });
  }
  function renameEnumerationItem(params: Omit<Parameters<ModelCommands['renameModelEnumerationItem']>[0], 'language'>) {
    commands.renameModelEnumerationItem({ ...params, language: Language.English });
    commands.renameModelEnumerationItem({ ...params, name: toTechnicalName(params.name), language: Language.Technical });
  }
  return { renameModel, renameAttribute, renameOperation, renameParameter, renameTypeParameter, renameEnumerationItem };
}

export function ModelEnglishView({ modelId, model, commands }: ModelEnglishViewProps) {
  const lang = Language.English;
  const rename = useEnglishRename(commands);

  const getName = (desc: Readonly<Partial<Record<Language, { name: string }>>>) =>
    desc[lang]?.name || desc[Language.Chinese]?.name || '';

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold mb-2">
        <ContentEditable
          className={cn({ 'inline-block min-w-24': !model.descriptions[lang]?.name })}
          content={getName(model.descriptions)}
          placeholder="Model name"
          onContentChange={(name) => {
            if (name.trim() !== '') {
              rename.renameModel({ modelId, name });
            }
          }}
        />
      </h1>
      <p>
        is a{' '}
        <StereotypeSelect
          language={lang}
          value={model.stereotype}
          onChange={(stereotype) => commands.editModelStereotype({ modelId, stereotype })}
        />{' '}
        in{' '}
        <ServiceSelector
          systemId={model.systemId}
          language={lang}
          value={model.serviceId}
          onChange={(serviceId) => commands.moveModelToService({ modelId, serviceId })}
        />
        ,{' '}
        <Select
          value={model.generalizationType !== null}
          onChange={(hasGeneralization) => {
            commands.editModelGeneralizationType({
              modelId,
              generalizationType: hasGeneralization ? TypeReference.createModel(null) : null,
            });
          }}
          items={[
            { label: 'a standalone concept', value: false },
            { label: 'extending' + (model.generalizationType ? '' : '...'), value: true },
          ]}
        />
        {model.generalizationType && (
          <>
            {' '}
            <TypeReferenceInput
              value={model.generalizationType}
              typeParameterModelId={model.id}
              language={lang}
              onChange={(generalizationType) => {
                commands.editModelGeneralizationType({ modelId, generalizationType });
              }}
            />
          </>
        )}
        ,{' '}
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
            { label: 'for a specific purpose', value: false },
            { label: 'for any purpose', value: true },
          ]}
        />
        .
      </p>

      {model.typeParameters.length > 0 && (
        <p className="group/type-parameters">
          Being generic, it works with the following type inputs:
          <DropdownMenu
            items={[{ label: 'Add type input', onSelect: () => commands.addModelTypeParameter({ modelId }) }]}
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
                content={getName(typeParameter.descriptions)}
                placeholder="Type input name"
                onContentChange={(name) =>
                  rename.renameTypeParameter({ modelId, typeParameterId: typeParameter.id, name })
                }
              />
              {': '}
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
                  { label: 'any kind', value: false },
                  { label: 'limited to' + (typeParameter.constraintType ? '' : '...'), value: true },
                ]}
              />
              {typeParameter.constraintType !== null && (
                <>
                  {' '}
                  <TypeReferenceInput
                    value={typeParameter.constraintType}
                    typeParameterModelId={model.id}
                    language={lang}
                    onChange={(constraintType) =>
                      commands.editModelTypeParameterConstraintType({ modelId, typeParameterId: typeParameter.id, constraintType })
                    }
                  />
                </>
              )}
              <DropdownMenu
                items={[
                  { label: 'Add type input', onSelect: () => commands.addModelTypeParameter({ modelId }) },
                  { label: 'Remove type input', onSelect: () => commands.removeModelTypeParameter({ modelId, typeParameterId: typeParameter.id }) },
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
              { label: 'No fields yet.', value: false },
              { label: 'Contains the following fields:', value: true },
            ]}
          />
          <DropdownMenu items={[{ label: 'Add field', onSelect: () => commands.addModelAttribute({ modelId }) }]}>
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
                content={getName(attribute.descriptions)}
                placeholder="Field name"
                onContentChange={(name) =>
                  rename.renameAttribute({ modelId, attributeId: attribute.id, name })
                }
              />
              {': '}
              <MultiplicitySelect
                language={lang}
                value={attribute.multiplicity}
                onChange={(multiplicity) => commands.editModelAttributeMultiplicity({ modelId, attributeId: attribute.id, multiplicity })}
              />
              <TypeReferenceInput
                value={attribute.type}
                typeParameterModelId={model.id}
                language={lang}
                onChange={(type) => commands.editModelAttributeType({ modelId, attributeId: attribute.id, attributeType: type })}
              />
              <DropdownMenu
                items={[
                  { label: 'Add field', onSelect: () => commands.addModelAttribute({ modelId }) },
                  { label: 'Remove field', onSelect: () => commands.removeModelAttribute({ modelId, attributeId: attribute.id }) },
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
                commands.addModelOperation({ modelId });
              } else {
                commands.removeAllModelOperations({ modelId });
              }
            }}
            items={[
              {
                label: model.stereotype === Stereotype.ExternalSystem
                  ? 'No actions to call yet.'
                  : 'No actions yet.',
                value: false,
              },
              {
                label: model.stereotype === Stereotype.ExternalSystem
                  ? 'Can call the following actions:'
                  : 'Can perform the following actions:',
                value: true,
              },
            ]}
          />
          <DropdownMenu items={[{ label: 'Add action', onSelect: () => commands.addModelOperation({ modelId }) }]}>
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
                  className={cn({ 'inline-block min-w-16': !operation.descriptions[lang]?.name })}
                  content={getName(operation.descriptions)}
                  placeholder="Action name"
                  onContentChange={(name) =>
                    rename.renameOperation({ modelId, operationId: operation.id, name })
                  }
                />
                ,{' '}
                <Select
                  value={operation.returnType !== null}
                  items={[
                    { label: 'with no result', value: false },
                    { label: 'giving back' + (operation.returnType ? '' : '...'), value: true },
                  ]}
                  onChange={(value) => {
                    commands.editModelOperationReturnType({
                      modelId,
                      operationId: operation.id,
                      returnType: value === false ? null : TypeReference.createModel(null),
                    });
                  }}
                />
                <MultiplicitySelect
                  language={lang}
                  value={operation.returnMultiplicity}
                  onChange={(multiplicity) => commands.editModelOperationMultiplicity({ modelId, operationId: operation.id, multiplicity })}
                />
                <TypeReferenceInput
                  value={operation.returnType}
                  typeParameterModelId={model.id}
                  language={lang}
                  onChange={(returnType) => {
                    if (returnType !== null) {
                      commands.editModelOperationReturnType({ modelId, operationId: operation.id, returnType });
                    }
                  }}
                />{' '}
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
                    { label: 'with no inputs', value: false },
                    { label: 'taking:', value: true },
                  ]}
                />
                <DropdownMenu
                  items={[
                    { label: 'Add action', onSelect: () => commands.addModelOperation({ modelId }) },
                    { label: 'Remove action', onSelect: () => commands.removeModelOperation({ modelId, operationId: operation.id }) },
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
                        content={getName(parameter.descriptions)}
                        placeholder="Input name"
                        onContentChange={(name) =>
                          rename.renameParameter({ modelId, operationId: operation.id, parameterId: parameter.id, name })
                        }
                      />
                      {': '}
                      <MultiplicitySelect
                        language={lang}
                        value={parameter.multiplicity}
                        onChange={(multiplicity) =>
                          commands.editModelOperationParameterMultiplicity({ modelId, operationId: operation.id, parameterId: parameter.id, multiplicity })
                        }
                      />
                      <TypeReferenceInput
                        value={parameter.type}
                        typeParameterModelId={model.id}
                        language={lang}
                        onChange={(parameterType) => {
                          if (parameterType !== null) {
                            commands.editModelOperationParameterType({ modelId, operationId: operation.id, parameterId: parameter.id, parameterType });
                          }
                        }}
                      />
                      <DropdownMenu
                        contentClassName="w-36"
                        items={[
                          { label: 'Add input', onSelect: () => commands.addModelOperationParameter({ modelId, operationId: operation.id }) },
                          { label: 'Remove input', onSelect: () => commands.removeModelOperationParameter({ modelId, operationId: operation.id, parameterId: parameter.id }) },
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
              { label: 'No items yet.', value: false },
              { label: 'Contains the following items:', value: true },
            ]}
          />
          <DropdownMenu items={[{ label: 'Add item', onSelect: () => commands.addModelEnumerationItem({ modelId }) }]}>
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
                content={getName(enumerationItem.descriptions)}
                placeholder="Item name"
                onContentChange={(name) =>
                  rename.renameEnumerationItem({ modelId, enumerationItemId: enumerationItem.id, name })
                }
              />
              {', code: "'}
              <ContentEditable
                className={cn({ 'inline-block min-w-8': !enumerationItem.code })}
                content={enumerationItem.code}
                placeholder="code"
                onContentChange={(code) => commands.editModelEnumerationItemCode({ modelId, enumerationItemId: enumerationItem.id, code })}
              />
              {'"'}
              <DropdownMenu
                items={[
                  { label: 'Add item', onSelect: () => commands.addModelEnumerationItem({ modelId }) },
                  { label: 'Remove item', onSelect: () => commands.removeModelEnumerationItem({ modelId, enumerationItemId: enumerationItem.id }) },
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
