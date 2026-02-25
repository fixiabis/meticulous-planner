import { Description } from './description';
import { Language, ProjectId, SystemId, SystemType } from './values';

export type SystemProps = {
  readonly id: SystemId;
  readonly projectId: ProjectId | null;
  readonly systemType: SystemType;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithSystemProps = Partial<Omit<SystemProps, 'id' | 'projectId'>>;

export type CreateSystemProps = Partial<SystemProps> & Pick<SystemProps, 'id'>;

export class System implements SystemProps {
  readonly id: SystemId;
  readonly projectId: ProjectId | null;
  readonly systemType: SystemType;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: SystemProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.systemType = props.systemType;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateSystemProps) {
    return new System({
      id: props.id,
      projectId: props.projectId ?? null,
      systemType: props.systemType ?? SystemType.Core,
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

  editSystemType(type: SystemType) {
    return this.withProps({ systemType: type });
  }
}
