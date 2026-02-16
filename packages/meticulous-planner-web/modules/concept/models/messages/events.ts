import { Event } from '@/modules/base/models/records/values';
import { BasePolicyProps, EditPolicyProps } from '../records/policy';
import { BaseTermProps, EditTermProps } from '../records/term';
import { PolicyId, ProjectId, TermId } from '../records/values';

export enum ConceptEventType {
  TermAdded = 'concept:term-added',
  TermEdited = 'concept:term-edited',
  TermRemoved = 'concept:term-removed',
  PolicyAdded = 'concept:policy-added',
  PolicyEdited = 'concept:policy-edited',
  PolicyRemoved = 'concept:policy-removed',
}

export class TermAdded extends Event<ConceptEventType.TermAdded> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly termId: TermId,
    public readonly termProps: BaseTermProps,
  ) {
    super(ConceptEventType.TermAdded);
  }
}

export class TermEdited extends Event<ConceptEventType.TermEdited> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly termId: TermId,
    public readonly termProps: EditTermProps,
  ) {
    super(ConceptEventType.TermEdited);
  }
}

export class TermRemoved extends Event<ConceptEventType.TermRemoved> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly termId: TermId,
  ) {
    super(ConceptEventType.TermRemoved);
  }
}

export class PolicyAdded extends Event<ConceptEventType.PolicyAdded> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly policyId: PolicyId,
    public readonly policyProps: BasePolicyProps,
  ) {
    super(ConceptEventType.PolicyAdded);
  }
}

export class PolicyEdited extends Event<ConceptEventType.PolicyEdited> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly policyId: PolicyId,
    public readonly policyProps: EditPolicyProps,
  ) {
    super(ConceptEventType.PolicyEdited);
  }
}

export class PolicyRemoved extends Event<ConceptEventType.PolicyRemoved> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly policyId: PolicyId,
  ) {
    super(ConceptEventType.PolicyRemoved);
  }
}
