import { Attribute } from '../attribute';
import { Model } from '../model';
import { Operation } from '../operation';
import { Parameter } from '../parameter';
import { TypeReference } from '../type-reference';
import { Language, Multiplicity, Stereotype, TypeReferenceType } from '../values';
import { kebabToCamelCase, kebabToPascalCase, toTechnicalName } from '@/lib/naming';

const BASE_TYPE_MAP: Record<string, string> = {
  'base-string': 'string',
  'base-integer': 'number',
  'base-decimal': 'number',
  'base-boolean': 'boolean',
  'base-date': 'Date',
  'base-datetime': 'Date',
  'base-time': 'Date',
  'base-awaitable': 'Promise',
};

function getRawTechnicalName(
  descriptions: Readonly<Partial<Record<Language, { name: string }>>>,
  fallback: string,
): string {
  return (
    descriptions[Language.Technical]?.name ||
    toTechnicalName(descriptions[Language.English]?.name || '') ||
    fallback
  );
}

/** Returns a PascalCase TypeScript type name (for classes, interfaces, types, enums). */
function getTypeName(
  descriptions: Readonly<Partial<Record<Language, { name: string }>>>,
  fallback: string,
): string {
  const technical =
    descriptions[Language.Technical]?.name ||
    toTechnicalName(descriptions[Language.English]?.name || '');
  if (technical) return kebabToPascalCase(technical) || technical;
  return fallback;
}

/** Returns a camelCase TypeScript member name (for attributes, operations, parameters). */
function getMemberName(
  descriptions: Readonly<Partial<Record<Language, { name: string }>>>,
  fallback: string,
): string {
  const technical =
    descriptions[Language.Technical]?.name ||
    toTechnicalName(descriptions[Language.English]?.name || '');
  if (technical) return kebabToCamelCase(technical) || technical;
  return fallback;
}

function resolveTypeRef(typeRef: TypeReference, allModels: Model[]): string {
  if (typeRef.type === TypeReferenceType.TypeParameter) {
    if (!typeRef.modelId || !typeRef.typeParameterId) return 'T';
    const ownerModel = allModels.find((m) => m.id === typeRef.modelId);
    if (!ownerModel) return 'T';
    const tp = ownerModel.typeParameters.find((tp) => tp.id === typeRef.typeParameterId);
    return tp ? getTypeName(tp.descriptions, 'T') : 'T';
  }

  if (!typeRef.modelId) return 'unknown';

  const baseTypeName = BASE_TYPE_MAP[typeRef.modelId as string];
  const targetModel = allModels.find((m) => m.id === typeRef.modelId);

  const typeArgStrs =
    targetModel && targetModel.typeParameters.length > 0
      ? targetModel.typeParameters
          .map((tp) => typeRef.typeArguments[tp.id])
          .filter((arg): arg is TypeReference => arg != null)
          .map((arg) => resolveTypeRef(arg, allModels))
      : [];

  const baseName =
    baseTypeName ?? (targetModel ? getTypeName(targetModel.descriptions, 'unknown') : 'unknown');
  return typeArgStrs.length > 0 ? `${baseName}<${typeArgStrs.join(', ')}>` : baseName;
}

function applyMultiplicity(type: string, multiplicity: Multiplicity): string {
  switch (multiplicity) {
    case Multiplicity.Optional:
      return `${type} | null`;
    case Multiplicity.Multiple:
      return `${type}[]`;
    case Multiplicity.AtLeastOne:
      return `[${type}, ...${type}[]]`;
    default:
      return type;
  }
}

function attrTypeStr(attr: Attribute, allModels: Model[]): string {
  if (!attr.type) return 'unknown';
  return applyMultiplicity(resolveTypeRef(attr.type, allModels), attr.multiplicity);
}

function paramTypeStr(param: Parameter, allModels: Model[]): string {
  if (!param.type) return 'unknown';
  return applyMultiplicity(resolveTypeRef(param.type, allModels), param.multiplicity);
}

function opReturnTypeStr(op: Operation, allModels: Model[]): string {
  if (!op.returnType) return 'void';
  return applyMultiplicity(resolveTypeRef(op.returnType, allModels), op.returnMultiplicity);
}

function buildTypeParamStr(model: Model): string {
  if (model.typeParameters.length === 0) return '';
  const names = model.typeParameters.map((tp) => getTypeName(tp.descriptions, tp.id));
  return `<${names.join(', ')}>`;
}

function formatCtorParams(pairs: Array<[string, string]>): string {
  if (pairs.length === 0) return '';
  return '\n' + pairs.map(([n, t]) => `    ${n}: ${t},`).join('\n') + '\n  ';
}

function formatOpParams(op: Operation, allModels: Model[]): string {
  if (op.parameters.length === 0) return '';
  const lines = op.parameters.map((p) => {
    const n = getMemberName(p.descriptions, '_param');
    const t = paramTypeStr(p, allModels);
    return `    ${n}: ${t},`;
  });
  return '\n' + lines.join('\n') + '\n  ';
}

function classOperations(model: Model, allModels: Model[]): string {
  return model.operations
    .map((op) => {
      const name = getMemberName(op.descriptions, '_operation');
      const params = formatOpParams(op, allModels);
      const retType = opReturnTypeStr(op, allModels);
      return `\n  ${name}(${params}): ${retType} {\n    // ...\n  }`;
    })
    .join('');
}

function interfaceOperations(model: Model, allModels: Model[]): string {
  return model.operations
    .map((op) => {
      const name = getMemberName(op.descriptions, '_operation');
      const params = formatOpParams(op, allModels);
      const retType = opReturnTypeStr(op, allModels);
      return `  ${name}(${params}): ${retType};`;
    })
    .join('\n');
}

function generateAggregateRoot(model: Model, allModels: Model[]): string {
  const name = getTypeName(model.descriptions, model.id);
  const tpStr = buildTypeParamStr(model);
  const extendsStr = model.generalizationType
    ? ` extends ${resolveTypeRef(model.generalizationType, allModels)}`
    : '';

  const ctorPairs: Array<[string, string]> = model.attributes.map((a) => [
    `readonly ${getMemberName(a.descriptions, '_field')}`,
    attrTypeStr(a, allModels),
  ]);
  const createPairs: Array<[string, string]> = model.attributes.map((a) => [
    getMemberName(a.descriptions, '_field'),
    attrTypeStr(a, allModels),
  ]);

  const ctorParams = formatCtorParams(ctorPairs);
  const createParams = formatCtorParams(createPairs);
  const ops = classOperations(model, allModels);

  return `export class ${name}${tpStr}${extendsStr} {
  private constructor(${ctorParams}) {}

  static create(${createParams}): ${name}${tpStr} {
    // ...
  }${ops}
}`;
}

function generateEntity(model: Model, allModels: Model[]): string {
  const name = getTypeName(model.descriptions, model.id);
  const tpStr = buildTypeParamStr(model);
  const extendsStr = model.generalizationType
    ? ` extends ${resolveTypeRef(model.generalizationType, allModels)}`
    : '';

  const ctorPairs: Array<[string, string]> = model.attributes.map((a) => [
    `readonly ${getMemberName(a.descriptions, '_field')}`,
    attrTypeStr(a, allModels),
  ]);
  const ctorParams = formatCtorParams(ctorPairs);
  const ops = classOperations(model, allModels);

  return `export class ${name}${tpStr}${extendsStr} {
  constructor(${ctorParams}) {}${ops}
}`;
}

function generateValueObject(model: Model, allModels: Model[]): string {
  const name = getTypeName(model.descriptions, model.id);
  const tpStr = buildTypeParamStr(model);
  const extendsStr = model.generalizationType
    ? ` extends ${resolveTypeRef(model.generalizationType, allModels)}`
    : '';

  const ctorPairs: Array<[string, string]> = model.attributes.map((a) => [
    `readonly ${getMemberName(a.descriptions, '_field')}`,
    attrTypeStr(a, allModels),
  ]);
  const ctorParams = formatCtorParams(ctorPairs);

  return `export class ${name}${tpStr}${extendsStr} {
  constructor(${ctorParams}) {}
}`;
}

function generateTypeAlias(model: Model, allModels: Model[]): string {
  const name = getTypeName(model.descriptions, model.id);
  const tpStr = buildTypeParamStr(model);

  const fields = model.attributes
    .map((a) => `  readonly ${getMemberName(a.descriptions, '_field')}: ${attrTypeStr(a, allModels)};`)
    .join('\n');

  if (model.generalizationType) {
    const baseType = resolveTypeRef(model.generalizationType, allModels);
    return fields
      ? `export type ${name}${tpStr} = ${baseType} & {\n${fields}\n};`
      : `export type ${name}${tpStr} = ${baseType};`;
  }

  return fields
    ? `export type ${name}${tpStr} = {\n${fields}\n};`
    : `export type ${name}${tpStr} = Record<string, never>;`;
}

function generateErrorClass(model: Model, allModels: Model[]): string {
  const baseName = getTypeName(model.descriptions, model.id);
  const name = baseName.endsWith('Error') ? baseName : `${baseName}Error`;
  const extendsStr = model.generalizationType
    ? ` extends ${resolveTypeRef(model.generalizationType, allModels)}`
    : ' extends Error';

  const ctorPairs: Array<[string, string]> = model.attributes.map((a) => [
    `readonly ${getMemberName(a.descriptions, '_field')}`,
    attrTypeStr(a, allModels),
  ]);
  const ctorParams = formatCtorParams(ctorPairs);

  return `export class ${name}${extendsStr} {
  constructor(${ctorParams}) {
    super('${name}');
  }
}`;
}

function generateInterface(model: Model, allModels: Model[], nameSuffix: string = ''): string {
  const baseName = getTypeName(model.descriptions, model.id);
  const name = `${baseName}${nameSuffix}`;
  const tpStr = buildTypeParamStr(model);
  const extendsStr = model.generalizationType
    ? ` extends ${resolveTypeRef(model.generalizationType, allModels)}`
    : '';

  const attrFields = model.attributes
    .map((a) => `  readonly ${getMemberName(a.descriptions, '_field')}: ${attrTypeStr(a, allModels)};`)
    .join('\n');

  const opMethods = interfaceOperations(model, allModels);
  const body = [attrFields, opMethods].filter(Boolean).join('\n');

  return body
    ? `export interface ${name}${tpStr}${extendsStr} {\n${body}\n}`
    : `export interface ${name}${tpStr}${extendsStr} {}`;
}

function generateEnum(model: Model): string {
  const name = getTypeName(model.descriptions, model.id);

  if (model.enumerationItems.length === 0) {
    return `export enum ${name} {}`;
  }

  const items = model.enumerationItems
    .map((item) => {
      const itemName = getTypeName(item.descriptions, item.id);
      const code = item.code || item.id;
      return `  ${itemName} = '${code}',`;
    })
    .join('\n');

  return `export enum ${name} {\n${items}\n}`;
}

export function generateTypeScriptCode(model: Model, allModels: Model[]): string {
  switch (model.stereotype) {
    case Stereotype.AggregateRoot:
      return generateAggregateRoot(model, allModels);
    case Stereotype.Entity:
      return generateEntity(model, allModels);
    case Stereotype.ValueObject:
      return generateValueObject(model, allModels);
    case Stereotype.Command:
    case Stereotype.Event:
    case Stereotype.Query:
    case Stereotype.ReadModel:
    case Stereotype.Actor:
      return generateTypeAlias(model, allModels);
    case Stereotype.Error:
      return generateErrorClass(model, allModels);
    case Stereotype.ExternalSystem:
      return generateInterface(model, allModels);
    case Stereotype.DomainService:
      return generateInterface(model, allModels, 'Service');
    case Stereotype.Enumeration:
      return generateEnum(model);
    default:
      return `// ${getRawTechnicalName(model.descriptions, model.id)}: unsupported stereotype`;
  }
}

export function getModelFilePath(model: Model): string {
  const technical = model.descriptions[Language.Technical]?.name;
  if (technical) return `${technical}.ts`;
  const name = model.descriptions[Language.Chinese]?.name || model.id;
  const kebab = name.replace(/\s+/g, '-').toLowerCase();
  return `${kebab}.ts`;
}
