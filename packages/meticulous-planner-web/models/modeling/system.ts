import { Description } from './description';
import { Language, SystemId } from './values';

export type SystemProps = {
  readonly id: SystemId;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithSystemProps = Partial<Omit<SystemProps, 'id' | 'systemId'>>;

export type CreateSystemProps = Partial<SystemProps> & Pick<SystemProps, 'id'>;

export class System implements SystemProps {
  readonly id: SystemId;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: SystemProps) {
    this.id = props.id;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateSystemProps) {
    return new System({
      id: props.id,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithSystemProps) {
    return new System({ ...this, ...props });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
