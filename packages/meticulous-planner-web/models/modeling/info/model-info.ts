import { Language, ModelId, ModuleId } from '../values';

export type ModelInfoProps = {
  readonly id: ModelId;
  readonly name: string;
  readonly language: Language;
  readonly moduleId: ModuleId;
  readonly moduleName: string;
};

export class ModelInfo implements ModelInfoProps {
  readonly id: ModelId;
  readonly name: string;
  readonly language: Language;
  readonly moduleId: ModuleId;
  readonly moduleName: string;

  constructor(props: ModelInfoProps) {
    this.id = props.id;
    this.name = props.name;
    this.language = props.language;
    this.moduleId = props.moduleId;
    this.moduleName = props.moduleName;
  }
}
