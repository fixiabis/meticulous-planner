import { ConceptGateway } from '../entrypoints/concept-gateway';
import { PolicyStore, TermStore } from '../models/dependencies';
import {
  AddPolicyCommand,
  AddTermCommand,
  EditPolicyCommand,
  EditTermCommand,
  RemovePolicyCommand,
  RemoveTermCommand,
} from '../models/messages/commands';
import { GetProjectPolicies, GetProjectTerms } from '../models/messages/queries';
import { Policy } from '../models/records/policy';
import { Term } from '../models/records/term';

export class ConceptService implements ConceptGateway {
  constructor(
    private readonly termStore: TermStore,
    private readonly policyStore: PolicyStore,
  ) {}

  async getProjectTerms(query: GetProjectTerms) {
    return this.termStore.findAllByQuery((term) => term.projectId === query.projectId);
  }

  async getProjectPolicies(query: GetProjectPolicies) {
    return this.policyStore.findAllByQuery((policy) => policy.projectId === query.projectId);
  }

  async addTerm(command: AddTermCommand) {
    const addedTerm = new Term({
      ...command.termProps,
      id: this.termStore.generateId(),
    })
      .clearDomainEvents()
      .added(command.termProps);

    this.termStore.put(addedTerm);

    return addedTerm.domainEvents;
  }

  async editTerm(command: EditTermCommand) {
    const editedTerm = this.termStore.getById(command.termId).clearDomainEvents().edit(command.termProps);
    this.termStore.put(editedTerm);
    return editedTerm.domainEvents;
  }

  async removeTerm(command: RemoveTermCommand) {
    const removedTerm = this.termStore.getById(command.termId).clearDomainEvents().removed();
    this.termStore.removeById(removedTerm.id);
    return removedTerm.domainEvents;
  }

  async addPolicy(command: AddPolicyCommand) {
    const addedPolicy = new Policy({
      ...command.policyProps,
      id: this.policyStore.generateId(),
    })
      .clearDomainEvents()
      .added(command.policyProps);

    this.policyStore.put(addedPolicy);

    return addedPolicy.domainEvents;
  }

  async editPolicy(command: EditPolicyCommand) {
    const editedPolicy = this.policyStore.getById(command.policyId).clearDomainEvents().edit(command.policyProps);
    this.policyStore.put(editedPolicy);
    return editedPolicy.domainEvents;
  }

  async removePolicy(command: RemovePolicyCommand) {
    const removedPolicy = this.policyStore.getById(command.policyId).clearDomainEvents().removed();
    this.policyStore.removeById(removedPolicy.id);
    return removedPolicy.domainEvents;
  }
}
