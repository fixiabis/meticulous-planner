import { Attribute } from '../attribute';
import { Model } from '../model';
import { Operation } from '../operation';
import { Parameter } from '../parameter';
import { TypeReference } from '../type-reference';
import { Language, Multiplicity, Stereotype, TypeReferenceType } from '../values';
import { kebabToPascalCase, kebabToSnakeCase, toTechnicalName } from '@/lib/naming';

const BASE_TYPE_MAP: Record<string, string> = {
  'base-string': 'str',
  'base-integer': 'int',
  'base-decimal': 'float',
  'base-boolean': 'bool',
  'base-date': 'date',
  'base-datetime': 'datetime',
  'base-time': 'time',
  'base-awaitable': 'Awaitable',
};

const BASE_IMPORT_MAP: Record<string, string> = {
  'base-date': 'from datetime import date',
  'base-datetime': 'from datetime import datetime',
  'base-time': 'from datetime import time',
  'base-awaitable': 'from typing import Awaitable',
};

type ImportSet = Set<string>;

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

function getMemberName(
  descriptions: Readonly<Partial<Record<Language, { name: string }>>>,
  fallback: string,
): string {
  const technical =
    descriptions[Language.Technical]?.name ||
    toTechnicalName(descriptions[Language.English]?.name || '');
  if (technical) return kebabToSnakeCase(technical) || technical;
  return fallback;
}

function resolveTypeRef(typeRef: TypeReference, allModels: Model[], imports: ImportSet): string {
  if (typeRef.type === TypeReferenceType.TypeParameter) {
    if (!typeRef.modelId || !typeRef.typeParameterId) return 'T';
    const ownerModel = allModels.find((m) => m.id === typeRef.modelId);
    if (!ownerModel) return 'T';
    const tp = ownerModel.typeParameters.find((tp) => tp.id === typeRef.typeParameterId);
    return tp ? getTypeName(tp.descriptions, 'T') : 'T';
  }

  if (!typeRef.modelId) {
    imports.add('from typing import Any');
    return 'Any';
  }

  const baseTypeName = BASE_TYPE_MAP[typeRef.modelId as string];
  const baseImport = BASE_IMPORT_MAP[typeRef.modelId as string];
  if (baseImport) imports.add(baseImport);

  const targetModel = allModels.find((m) => m.id === typeRef.modelId);

  const typeArgStrs =
    targetModel && targetModel.typeParameters.length > 0
      ? targetModel.typeParameters
          .map((tp) => typeRef.typeArguments[tp.id])
          .filter((arg): arg is TypeReference => arg != null)
          .map((arg) => resolveTypeRef(arg, allModels, imports))
      : [];

  const baseName =
    baseTypeName ?? (targetModel ? getTypeName(targetModel.descriptions, 'Any') : 'Any');
  return typeArgStrs.length > 0 ? `${baseName}[${typeArgStrs.join(', ')}]` : baseName;
}

function applyMultiplicity(type: string, multiplicity: Multiplicity, imports: ImportSet): string {
  switch (multiplicity) {
    case Multiplicity.Optional:
      imports.add('from typing import Optional');
      return `Optional[${type}]`;
    case Multiplicity.Multiple:
    case Multiplicity.AtLeastOne:
      return `list[${type}]`;
    default:
      return type;
  }
}

function attrTypeStr(attr: Attribute, allModels: Model[], imports: ImportSet): string {
  if (!attr.type) {
    imports.add('from typing import Any');
    return 'Any';
  }
  return applyMultiplicity(resolveTypeRef(attr.type, allModels, imports), attr.multiplicity, imports);
}

function paramTypeStr(param: Parameter, allModels: Model[], imports: ImportSet): string {
  if (!param.type) {
    imports.add('from typing import Any');
    return 'Any';
  }
  return applyMultiplicity(
    resolveTypeRef(param.type, allModels, imports),
    param.multiplicity,
    imports,
  );
}

function opReturnTypeStr(op: Operation, allModels: Model[], imports: ImportSet): string {
  if (!op.returnType) return 'None';
  return applyMultiplicity(
    resolveTypeRef(op.returnType, allModels, imports),
    op.returnMultiplicity,
    imports,
  );
}

function buildInheritance(
  model: Model,
  allModels: Model[],
  imports: ImportSet,
  extraBases: string[] = [],
): string {
  const bases: string[] = [...extraBases];

  if (model.generalizationType) {
    bases.unshift(resolveTypeRef(model.generalizationType, allModels, imports));
  }

  if (model.typeParameters.length > 0) {
    imports.add('from typing import Generic');
    const tpNames = model.typeParameters.map((tp) => getTypeName(tp.descriptions, tp.id));
    bases.push(`Generic[${tpNames.join(', ')}]`);
  }

  return bases.length > 0 ? `(${bases.join(', ')})` : '';
}

function formatCtorParams(pairs: Array<[string, string]>): string {
  if (pairs.length === 0) return '';
  return ', ' + pairs.map(([n, t]) => `${n}: ${t}`).join(', ');
}

function formatOpParams(op: Operation, allModels: Model[], imports: ImportSet): string {
  if (op.parameters.length === 0) return '';
  return (
    ', ' +
    op.parameters
      .map((p) => {
        const n = getMemberName(p.descriptions, 'param');
        const t = paramTypeStr(p, allModels, imports);
        return `${n}: ${t}`;
      })
      .join(', ')
  );
}

function classOperations(model: Model, allModels: Model[], imports: ImportSet): string {
  return model.operations
    .map((op) => {
      const name = getMemberName(op.descriptions, 'operation');
      const params = formatOpParams(op, allModels, imports);
      const retType = opReturnTypeStr(op, allModels, imports);
      return `\n    def ${name}(self${params}) -> ${retType}:\n        # ...\n        pass`;
    })
    .join('');
}

function protocolOperations(model: Model, allModels: Model[], imports: ImportSet): string {
  const attrLines = model.attributes
    .map((a) => `    ${getMemberName(a.descriptions, 'field')}: ${attrTypeStr(a, allModels, imports)}`)
    .join('\n');

  const opLines = model.operations
    .map((op) => {
      const name = getMemberName(op.descriptions, 'operation');
      const params = formatOpParams(op, allModels, imports);
      const retType = opReturnTypeStr(op, allModels, imports);
      return `    def ${name}(self${params}) -> ${retType}: ...`;
    })
    .join('\n');

  return [attrLines, opLines].filter(Boolean).join('\n') || '    ...';
}

function generateAggregateRoot(model: Model, allModels: Model[], imports: ImportSet): string {
  const name = getTypeName(model.descriptions, model.id);
  const inheritance = buildInheritance(model, allModels, imports);

  const attrPairs: Array<[string, string]> = model.attributes.map((a) => [
    getMemberName(a.descriptions, 'field'),
    attrTypeStr(a, allModels, imports),
  ]);

  const ctorParams = formatCtorParams(attrPairs);
  const ctorBody =
    attrPairs.length > 0
      ? attrPairs.map(([n]) => `        self.${n} = ${n}`).join('\n')
      : '        pass';

  const ops = classOperations(model, allModels, imports);

  return `class ${name}${inheritance}:
    def __init__(self${ctorParams}) -> None:
${ctorBody}

    @classmethod
    def create(cls${ctorParams}) -> '${name}':
        # ...
        pass${ops}`;
}

function generateEntity(model: Model, allModels: Model[], imports: ImportSet): string {
  const name = getTypeName(model.descriptions, model.id);
  const inheritance = buildInheritance(model, allModels, imports);

  const attrPairs: Array<[string, string]> = model.attributes.map((a) => [
    getMemberName(a.descriptions, 'field'),
    attrTypeStr(a, allModels, imports),
  ]);

  const ctorParams = formatCtorParams(attrPairs);
  const ctorBody =
    attrPairs.length > 0
      ? attrPairs.map(([n]) => `        self.${n} = ${n}`).join('\n')
      : '        pass';

  const ops = classOperations(model, allModels, imports);

  return `class ${name}${inheritance}:
    def __init__(self${ctorParams}) -> None:
${ctorBody}${ops}`;
}

function generateValueObject(model: Model, allModels: Model[], imports: ImportSet): string {
  imports.add('from dataclasses import dataclass');
  const name = getTypeName(model.descriptions, model.id);
  const inheritance = buildInheritance(model, allModels, imports);

  const fields = model.attributes
    .map((a) => `    ${getMemberName(a.descriptions, 'field')}: ${attrTypeStr(a, allModels, imports)}`)
    .join('\n');

  return `@dataclass(frozen=True)
class ${name}${inheritance}:
${fields || '    pass'}`;
}

function generateDataClass(model: Model, allModels: Model[], imports: ImportSet): string {
  imports.add('from dataclasses import dataclass');
  const name = getTypeName(model.descriptions, model.id);
  const inheritance = buildInheritance(model, allModels, imports);

  const fields = model.attributes
    .map((a) => `    ${getMemberName(a.descriptions, 'field')}: ${attrTypeStr(a, allModels, imports)}`)
    .join('\n');

  return `@dataclass
class ${name}${inheritance}:
${fields || '    pass'}`;
}

function generateErrorClass(model: Model, allModels: Model[], imports: ImportSet): string {
  const baseName = getTypeName(model.descriptions, model.id);
  const name = baseName.endsWith('Error') ? baseName : `${baseName}Error`;

  const baseClass = model.generalizationType
    ? resolveTypeRef(model.generalizationType, allModels, imports)
    : 'Exception';

  const attrPairs: Array<[string, string]> = model.attributes.map((a) => [
    getMemberName(a.descriptions, 'field'),
    attrTypeStr(a, allModels, imports),
  ]);

  const ctorParams = formatCtorParams(attrPairs);
  const attrAssignments =
    attrPairs.length > 0
      ? attrPairs.map(([n]) => `        self.${n} = ${n}`).join('\n') + '\n'
      : '';

  return `class ${name}(${baseClass}):
    def __init__(self${ctorParams}) -> None:
${attrAssignments}        super().__init__('${name}')`;
}

function generateProtocol(
  model: Model,
  allModels: Model[],
  imports: ImportSet,
  nameSuffix: string = '',
): string {
  imports.add('from typing import Protocol');
  const baseName = getTypeName(model.descriptions, model.id);
  const name = `${baseName}${nameSuffix}`;

  const protocolBase =
    model.typeParameters.length > 0
      ? (() => {
          imports.add('from typing import Generic');
          const tpNames = model.typeParameters.map((tp) => getTypeName(tp.descriptions, tp.id));
          return `Protocol[${tpNames.join(', ')}]`;
        })()
      : 'Protocol';

  const bases: string[] = [protocolBase];
  if (model.generalizationType) {
    bases.unshift(resolveTypeRef(model.generalizationType, allModels, imports));
  }

  const body = protocolOperations(model, allModels, imports);

  return `class ${name}(${bases.join(', ')}):
${body}`;
}

function generateEnum(model: Model, imports: ImportSet): string {
  imports.add('from enum import Enum');
  const name = getTypeName(model.descriptions, model.id);

  if (model.enumerationItems.length === 0) {
    return `class ${name}(Enum):
    pass`;
  }

  const items = model.enumerationItems
    .map((item) => {
      const itemName = getTypeName(item.descriptions, item.id).toUpperCase();
      const code = item.code || item.id;
      return `    ${itemName} = '${code}'`;
    })
    .join('\n');

  return `class ${name}(Enum):
${items}`;
}

export function generatePythonCode(model: Model, allModels: Model[]): string {
  const imports: ImportSet = new Set();
  let classCode: string;

  switch (model.stereotype) {
    case Stereotype.AggregateRoot:
      classCode = generateAggregateRoot(model, allModels, imports);
      break;
    case Stereotype.Entity:
      classCode = generateEntity(model, allModels, imports);
      break;
    case Stereotype.ValueObject:
      classCode = generateValueObject(model, allModels, imports);
      break;
    case Stereotype.Command:
    case Stereotype.Event:
    case Stereotype.Query:
    case Stereotype.ReadModel:
    case Stereotype.Actor:
      classCode = generateDataClass(model, allModels, imports);
      break;
    case Stereotype.Error:
      classCode = generateErrorClass(model, allModels, imports);
      break;
    case Stereotype.ExternalSystem:
      classCode = generateProtocol(model, allModels, imports);
      break;
    case Stereotype.DomainService:
      classCode = generateProtocol(model, allModels, imports, 'Service');
      break;
    case Stereotype.Enumeration:
      classCode = generateEnum(model, imports);
      break;
    default:
      return `# ${getRawTechnicalName(model.descriptions, model.id)}: unsupported stereotype`;
  }

  // Prepend TypeVar definitions for generic models
  let typeVarDefs = '';
  if (model.typeParameters.length > 0) {
    imports.add('from typing import TypeVar');
    typeVarDefs = model.typeParameters
      .map((tp) => {
        const tpName = getTypeName(tp.descriptions, tp.id);
        return `${tpName} = TypeVar('${tpName}')`;
      })
      .join('\n');
  }

  const importLines = [...imports].sort().join('\n');
  const parts = [importLines, typeVarDefs, classCode].filter(Boolean);
  return parts.join('\n\n\n');
}

export function getPythonModelFilePath(model: Model): string {
  const technical = model.descriptions[Language.Technical]?.name;
  if (technical) return `${technical.replace(/-/g, '_')}.py`;
  const name = model.descriptions[Language.Chinese]?.name || model.id;
  return `${name.replace(/\s+/g, '_').toLowerCase()}.py`;
}
