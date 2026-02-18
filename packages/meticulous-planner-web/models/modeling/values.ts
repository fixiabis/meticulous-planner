export type ProjectId = string & { readonly __brand: 'ProjectId' };
export const ProjectId = (value: string) => value as ProjectId;

export type ModuleId = string & { readonly __brand: 'ModuleId' };
export const ModuleId = (value: string) => value as ModuleId;

export type ModelId = string & { readonly __brand: 'ModelId' };
export const ModelId = (value: string) => value as ModelId;

export type TypeParameterId = string & { readonly __brand: 'TypeParameterId' };
export const TypeParameterId = (value: string) => value as TypeParameterId;

export type AttributeId = string & { readonly __brand: 'AttributeId' };
export const AttributeId = (value: string) => value as AttributeId;

export type OperationId = string & { readonly __brand: 'OperationId' };
export const OperationId = (value: string) => value as OperationId;

export type ParameterId = string & { readonly __brand: 'ParameterId' };
export const ParameterId = (value: string) => value as ParameterId;

export type EnumerationItemId = string & { readonly __brand: 'EnumerationItemId' };
export const EnumerationItemId = (value: string) => value as EnumerationItemId;

export enum Stereotype {
  Command = 'command',
  Event = 'event',
  Query = 'query',
  Error = 'error',
  AggregateRoot = 'aggregate-root',
  Entity = 'entity',
  ValueObject = 'value-object',
  ExternalSystem = 'external-system',
  ReadModel = 'read-model',
  DomainService = 'domain-service',
  Actor = 'actor',
  Application = 'application',
  Enumeration = 'enumeration',
}

export enum Multiplicity {
  Optional = '0..1',
  Single = '1',
  AtLeastOne = '1..n',
  Multiple = '0..n',
}

export enum BaseModelType {
  None = 'none',

  Boolean = 'boolean',
  Integer = 'integer',
  Decimal = 'decimal',
  String = 'string',
  Date = 'date',
  DateTime = 'datetime',
  Time = 'time',

  Awaitable = 'awaitable',
}

export enum TypeReferenceType {
  Model = 'model',
  BaseModel = 'base-model',
  TypeParameter = 'type-parameter',
}

export enum Language {
  Technical = 'technical',
  English = 'english',
  Chinese = 'chinese',
}
