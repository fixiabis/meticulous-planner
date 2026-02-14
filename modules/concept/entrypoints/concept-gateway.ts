import { Event as Base_Event } from '@/modules/base/models/records/values';
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

export interface ConceptGateway {
  getProjectTerms(query: GetProjectTerms): Promise<Term[]>;
  getProjectPolicies(query: GetProjectPolicies): Promise<Policy[]>;
  addTerm(command: AddTermCommand): Promise<Base_Event[]>;
  editTerm(command: EditTermCommand): Promise<Base_Event[]>;
  removeTerm(command: RemoveTermCommand): Promise<Base_Event[]>;
  addPolicy(command: AddPolicyCommand): Promise<Base_Event[]>;
  editPolicy(command: EditPolicyCommand): Promise<Base_Event[]>;
  removePolicy(command: RemovePolicyCommand): Promise<Base_Event[]>;
}
