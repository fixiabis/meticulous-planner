import { Expression } from './expression';
import { EnumerationItemId, ExpressionLanguage } from './values';

export type EnumerationItemProps = {
  readonly id: EnumerationItemId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly code: string;
};

export type CreateEnumerationItemProps = Pick<EnumerationItemProps, 'id'> & Partial<EnumerationItemProps>;

export class EnumerationItem implements EnumerationItemProps {
  readonly id: EnumerationItemId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly code: string;

  constructor(props: EnumerationItemProps) {
    this.id = props.id;
    this.names = props.names;
    this.code = props.code;
  }

  static create(props: CreateEnumerationItemProps): EnumerationItem {
    return new EnumerationItem({
      id: props.id,
      names: props.names ?? {},
      code: props.code ?? '',
    });
  }

  private withProps(props: Partial<EnumerationItemProps>): EnumerationItem {
    return EnumerationItem.create({ ...this, ...props });
  }

  editName(language: ExpressionLanguage, name: string): EnumerationItem {
    const expression = new Expression({ language, content: name });
    const names = { ...this.names, [language]: expression };
    return this.withProps({ names });
  }

  editCode(code: string): EnumerationItem {
    return this.withProps({ code });
  }
}
