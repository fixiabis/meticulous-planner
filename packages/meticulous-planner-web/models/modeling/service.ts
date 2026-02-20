import { Description } from './description';
import { Language, ServiceId, SystemId } from './values';

export type SystemUnitProps = {
  readonly id: ServiceId;
  readonly systemId: SystemId;
  readonly isBase: boolean;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithSystemUnitProps = Partial<Omit<SystemUnitProps, 'id' | 'systemId' | 'isBase'>>;

export type CreateSystemUnitProps = Partial<SystemUnitProps> & Pick<SystemUnitProps, 'id' | 'systemId'>;

export class Service implements SystemUnitProps {
  readonly id: ServiceId;
  readonly systemId: SystemId;
  readonly isBase: boolean;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: SystemUnitProps) {
    this.id = props.id;
    this.systemId = props.systemId;
    this.isBase = props.isBase;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateSystemUnitProps) {
    return new Service({
      id: props.id,
      systemId: props.systemId,
      isBase: props.isBase ?? false,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithSystemUnitProps) {
    return new Service({ ...this, ...props });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
