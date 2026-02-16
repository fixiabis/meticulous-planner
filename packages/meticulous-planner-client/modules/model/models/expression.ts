import { ExpressionLanguage } from './values';

export type ExpressionProps = {
  readonly language: ExpressionLanguage;
  readonly content: string;
};

export type CreateExpressionProps = Pick<ExpressionProps, 'language'> & Partial<ExpressionProps>;

export class Expression implements ExpressionProps {
  readonly language: ExpressionLanguage;
  readonly content: string;

  constructor(props: ExpressionProps) {
    this.language = props.language;
    this.content = props.content;
  }

  static create(props: CreateExpressionProps): Expression {
    return new Expression({
      language: props.language,
      content: props.content ?? '',
    });
  }
}
