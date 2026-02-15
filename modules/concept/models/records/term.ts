import { Event as Base_Event } from '@/modules/base/models/records/values';
import { ProjectId } from './values';
import { TermId } from './values';
import { TermType } from './values';
import { TermAdded, TermEdited, TermRemoved } from '../messages/events';

export type TermProps = {
  readonly id: TermId;
  readonly domainEvents: Base_Event[];
  readonly projectId: ProjectId;
  readonly type: TermType;
  readonly language: string;
  readonly name: string;
  readonly description: string;
  readonly canonicalTermId: TermId | null;
  readonly boundedContextTermId: TermId | null;
};

export type BaseTermProps = Pick<TermProps, 'id' | 'projectId' | 'type' | 'language'> & Partial<TermProps>;

export type WithTermProps = Partial<Omit<TermProps, 'id' | 'projectId' | 'type' | 'language'>>;

export type EditTermProps = Omit<WithTermProps, 'domainEvents'>;

export class Term implements TermProps {
  readonly id: TermId;
  readonly domainEvents: Base_Event[];
  readonly projectId: ProjectId;
  readonly type: TermType;
  readonly language: string;
  readonly name: string;
  readonly description: string;
  readonly canonicalTermId: TermId | null;
  readonly boundedContextTermId: TermId | null;

  constructor(props: BaseTermProps) {
    this.id = props.id;
    this.domainEvents = props.domainEvents ?? [];
    this.projectId = props.projectId;
    this.type = props.type;
    this.language = props.language;
    this.name = props.name ?? '';
    this.description = props.description ?? '';
    this.canonicalTermId = props.canonicalTermId ?? null;
    this.boundedContextTermId = props.boundedContextTermId ?? null;
  }

  isCanonical() {
    return this.canonicalTermId === null;
  }

  added(props: BaseTermProps): Term {
    return this.withProps({
      domainEvents: [...this.domainEvents, new TermAdded(this.projectId, this.id, props)],
    });
  }

  edit(props: EditTermProps) {
    return this.withProps({
      ...props,
      domainEvents: [...this.domainEvents, new TermEdited(this.projectId, this.id, props)],
    });
  }

  removed() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new TermRemoved(this.projectId, this.id)],
    });
  }

  clearDomainEvents() {
    return this.withProps({ domainEvents: [] });
  }

  private withProps(props: WithTermProps) {
    return new Term({
      ...this,
      ...props,
      id: this.id,
      projectId: this.projectId,
      type: this.type,
      language: this.language,
    });
  }
}
