export type ProjectId = string & { _type: 'project-id' };
export const ProjectId = (value: string) => value as ProjectId;

export type TermId = string & { _type: 'term-id' };
export const TermId = (value: string) => value as TermId;

export enum TermType {
  Event = 'event',
  Command = 'command',
  Actor = 'actor',
  ReadModel = 'read-model',
  AggregateRoot = 'aggregate-root',
  Entity = 'entity',
  ValueObject = 'value-object',
  Enumerable = 'enumerable',
  ExternalSystem = 'external-system',
  Interface = 'interface',
  DomainService = 'domain-service',
  BoundedContext = 'bounded-context',
}

export type PolicyId = string & { _type: 'policy-id' };
export const PolicyId = (value: string) => value as PolicyId;
