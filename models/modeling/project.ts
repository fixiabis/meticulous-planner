import { Description } from './description';
import { Language, ProjectId } from './values';

export type ProjectProps = {
  readonly id: ProjectId;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithProjectProps = Partial<Omit<ProjectProps, 'id'>>;

export type CreateProjectProps = Partial<ProjectProps> & Pick<ProjectProps, 'id'>;

export class Project implements ProjectProps {
  readonly id: ProjectId;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateProjectProps) {
    return new Project({
      id: props.id,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithProjectProps) {
    return new Project({ ...this, ...props });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
