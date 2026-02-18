import { Language, ModuleId } from '../values';

export type ModuleInfoProps = {
  readonly id: ModuleId;
  readonly language: Language;
  readonly name: string;
};

export class ModuleInfo implements ModuleInfoProps {
  readonly id: ModuleId;
  readonly language: Language;
  readonly name: string;

  constructor(props: ModuleInfoProps) {
    this.id = props.id;
    this.language = props.language;
    this.name = props.name;
  }
}
