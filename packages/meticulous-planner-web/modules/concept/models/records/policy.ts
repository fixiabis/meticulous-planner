import { Event as Base_Event } from '@/modules/base/models/records/values';
import { PolicyId } from './values';
import { ProjectId } from './values';
import { TermId } from './values';
import { PolicyAdded, PolicyEdited, PolicyRemoved } from '../messages/events';

export type PolicyProps = {
  readonly id: PolicyId;
  readonly domainEvents: Base_Event[];
  readonly projectId: ProjectId;
  readonly eventTermId: TermId | null;
  readonly actorTermId: TermId | null;
  readonly commandTermId: TermId | null;
};

export type BasePolicyProps = Pick<PolicyProps, 'id' | 'projectId'> & Partial<PolicyProps>;

export type WithPolicyProps = Partial<Omit<PolicyProps, 'id' | 'projectId'>>;

export type EditPolicyProps = Omit<WithPolicyProps, 'domainEvents'>;

export class Policy implements PolicyProps {
  readonly id: PolicyId;
  readonly domainEvents: Base_Event[];
  readonly projectId: ProjectId;
  readonly eventTermId: TermId | null;
  readonly actorTermId: TermId | null;
  readonly commandTermId: TermId | null;

  constructor(props: BasePolicyProps) {
    this.id = props.id;
    this.domainEvents = props.domainEvents ?? [];
    this.projectId = props.projectId;
    this.eventTermId = props.eventTermId ?? null;
    this.actorTermId = props.actorTermId ?? null;
    this.commandTermId = props.commandTermId ?? null;
  }

  added(props: BasePolicyProps) {
    return this.withProps({
      domainEvents: [...this.domainEvents, new PolicyAdded(this.projectId, this.id, props)],
    });
  }

  edit(props: EditPolicyProps) {
    return this.withProps({
      ...props,
      domainEvents: [...this.domainEvents, new PolicyEdited(this.projectId, this.id, props)],
    });
  }

  removed() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new PolicyRemoved(this.projectId, this.id)],
    });
  }

  clearDomainEvents() {
    return this.withProps({ domainEvents: [] });
  }

  private withProps(props: WithPolicyProps) {
    return new Policy({
      ...this,
      ...props,
      id: this.id,
      projectId: this.projectId,
    });
  }
}
