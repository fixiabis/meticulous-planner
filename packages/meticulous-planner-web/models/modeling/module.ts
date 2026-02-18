import { Description } from './description';
import { Language, ModuleId } from './values';

export type ModuleProps = {
  readonly id: ModuleId;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithModuleProps = Partial<Omit<ModuleProps, 'id'>>;

export type CreateModuleProps = Partial<ModuleProps> & Pick<ModuleProps, 'id'>;

export class Module implements ModuleProps {
  readonly id: ModuleId;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ModuleProps) {
    this.id = props.id;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateModuleProps) {
    return new Module({
      id: props.id,
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
