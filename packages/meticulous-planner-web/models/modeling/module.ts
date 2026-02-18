import { Description } from './description';
import { Language, ModuleId, ProjectId } from './values';

export type ModuleProps = {
  readonly id: ModuleId;
  readonly projectId: ProjectId;
  readonly isBase: boolean;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithModuleProps = Partial<Omit<ModuleProps, 'id' | 'projectId' | 'isBase'>>;

export type CreateModuleProps = Partial<ModuleProps> & Pick<ModuleProps, 'id' | 'projectId'>;

export class Module implements ModuleProps {
  readonly id: ModuleId;
  readonly projectId: ProjectId;
  readonly isBase: boolean;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ModuleProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.isBase = props.isBase;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateModuleProps) {
    return new Module({
      id: props.id,
      projectId: props.projectId,
      isBase: props.isBase ?? false,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithModuleProps) {
    return new Module({ ...this, ...props });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
