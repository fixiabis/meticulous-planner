import { Description } from './description';
import { Language, ProjectId, ServiceId, ServiceType, SystemId } from './values';

export type ServiceProps = {
  readonly id: ServiceId;
  readonly projectId: ProjectId | null;
  readonly systemId: SystemId;
  readonly isBase: boolean;
  readonly serviceType: ServiceType;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithServiceProps = Partial<Omit<ServiceProps, 'id' | 'projectId' | 'systemId' | 'isBase'>>;

export type CreateServiceProps = Partial<ServiceProps> & Pick<ServiceProps, 'id' | 'systemId'>;

export class Service implements ServiceProps {
  readonly id: ServiceId;
  readonly projectId: ProjectId | null;
  readonly systemId: SystemId;
  readonly isBase: boolean;
  readonly serviceType: ServiceType;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.systemId = props.systemId;
    this.isBase = props.isBase;
    this.serviceType = props.serviceType;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateServiceProps) {
    return new Service({
      id: props.id,
      projectId: props.projectId ?? null,
      systemId: props.systemId,
      isBase: props.isBase ?? false,
      serviceType: props.serviceType ?? ServiceType.Core,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithServiceProps) {
    return new Service({ ...this, ...props });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }

  editServiceType(type: ServiceType) {
    return this.withProps({ serviceType: type });
  }
}
