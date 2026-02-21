import { Description } from './description';
import { Language, ServiceId, SystemId } from './values';

export type ServiceProps = {
  readonly id: ServiceId;
  readonly systemId: SystemId;
  readonly isBase: boolean;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithServiceProps = Partial<Omit<ServiceProps, 'id' | 'systemId' | 'isBase'>>;

export type CreateServiceProps = Partial<ServiceProps> & Pick<ServiceProps, 'id' | 'systemId'>;

export class Service implements ServiceProps {
  readonly id: ServiceId;
  readonly systemId: SystemId;
  readonly isBase: boolean;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.systemId = props.systemId;
    this.isBase = props.isBase;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateServiceProps) {
    return new Service({
      id: props.id,
      systemId: props.systemId,
      isBase: props.isBase ?? false,
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
}
