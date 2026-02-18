import { Language } from './values';

export type DescriptionProps = {
  readonly name: string;
  readonly language: Language;
};

export class Description implements DescriptionProps {
  readonly name: string;
  readonly language: Language;

  constructor(props: DescriptionProps) {
    this.name = props.name;
    this.language = props.language;
  }

  static create(props: DescriptionProps) {
    return new Description(props);
  }
}
