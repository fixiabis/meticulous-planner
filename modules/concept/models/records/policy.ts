import { Event as Base_Event } from '@/modules/base/models/records/values';
import { PolicyId } from './values';
import { ProjectId } from './values';
import { TermId } from './values';
import { PolicyAdded, PolicyEdited, PolicyRemoved } from '../messages/events';

export type PolicyProps = {
  readonly id: PolicyId;
  readonly events: Base_Event[];
  readonly projectId: ProjectId;
  readonly eventTermId: TermId | null;
  readonly actorTermId: TermId | null;
  readonly commandTermId: TermId | null;
};

export type BasePolicyProps = Pick<PolicyProps, 'id' | 'projectId'> & Partial<PolicyProps>;

export type EditPolicyProps = Partial<Omit<PolicyProps, 'id' | 'projectId'>>;

export class Policy {
  readonly id: PolicyId;
  readonly events: Base_Event[];
  readonly projectId: ProjectId;
  readonly eventTermId: TermId | null;
  readonly actorTermId: TermId | null;
  readonly commandTermId: TermId | null;

  constructor(props: BasePolicyProps) {
    this.id = props.id;
    this.events = props.events ?? [];
    this.projectId = props.projectId;
    this.eventTermId = props.eventTermId ?? null;
    this.actorTermId = props.actorTermId ?? null;
    this.commandTermId = props.commandTermId ?? null;
  }

  added(props: BasePolicyProps) {
    return this.withProps({ events: [...this.events, new PolicyAdded(this.projectId, this.id, props)] });
  }

  edit(props: EditPolicyProps) {
    return this.withProps({ ...props, events: [...this.events, new PolicyEdited(this.projectId, this.id, props)] });
  }

  removed() {
    return this.withProps({ events: [...this.events, new PolicyRemoved(this.projectId, this.id)] });
  }

  withProps(props: EditPolicyProps) {
    return new Policy({
      ...this,
      ...props,
      id: this.id,
      projectId: this.projectId,
    });
  }
}
