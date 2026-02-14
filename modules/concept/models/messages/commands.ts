import { Command as BaseCommand } from '@/modules/base/models/records/values';
import { PolicyId, ProjectId, TermId } from '../records/values';
import { BaseTermProps, EditTermProps } from '../records/term';
import { BasePolicyProps, EditPolicyProps } from '../records/policy';

export enum ConceptCommandType {
  AddTerm = 'concept:add-term',
  EditTerm = 'concept:edit-term',
  RemoveTerm = 'concept:remove-term',
  AddPolicy = 'concept:add-policy',
  EditPolicy = 'concept:edit-policy',
  RemovePolicy = 'concept:remove-policy',
}

export class AddTermCommand extends BaseCommand<ConceptCommandType.AddTerm> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly termProps: BaseTermProps,
  ) {
    super(ConceptCommandType.AddTerm);
  }
}

export class EditTermCommand extends BaseCommand<ConceptCommandType.EditTerm> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly termId: TermId,
    public readonly termProps: EditTermProps,
  ) {
    super(ConceptCommandType.EditTerm);
  }
}

export class RemoveTermCommand extends BaseCommand<ConceptCommandType.RemoveTerm> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly termId: TermId,
  ) {
    super(ConceptCommandType.RemoveTerm);
  }
}

export class AddPolicyCommand extends BaseCommand<ConceptCommandType.AddPolicy> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly policyProps: BasePolicyProps,
  ) {
    super(ConceptCommandType.AddPolicy);
  }
}

export class EditPolicyCommand extends BaseCommand<ConceptCommandType.EditPolicy> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly policyId: PolicyId,
    public readonly policyProps: EditPolicyProps,
  ) {
    super(ConceptCommandType.EditPolicy);
  }
}

export class RemovePolicyCommand extends BaseCommand<ConceptCommandType.RemovePolicy> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly policyId: PolicyId,
  ) {
    super(ConceptCommandType.RemovePolicy);
  }
}
