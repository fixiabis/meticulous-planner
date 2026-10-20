import { Description } from './description';
import { EnumerationItemId, Language } from './values';

export type EnumerationItemProps = {
  readonly id: EnumerationItemId;
  readonly code: string;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithEnumerationItemProps = Partial<Omit<EnumerationItemProps, 'id'>>;

export type CreateEnumerationItemProps = Partial<EnumerationItemProps> & Pick<EnumerationItemProps, 'id'>;

export class EnumerationItem implements EnumerationItemProps {
  readonly id: EnumerationItemId;
  readonly code: string;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: EnumerationItemProps) {
    this.id = props.id;
    this.code = props.code;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateEnumerationItemProps) {
    return new EnumerationItem({
      id: props.id,
      code: props.code ?? '',
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithEnumerationItemProps) {
    return new EnumerationItem({ ...this, ...props });
  }

  editCode(code: string) {
    return this.withProps({ code });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
