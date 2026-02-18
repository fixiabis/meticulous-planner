import { Language } from '../values';

export enum ModelingCommandType {
  AddModule = 'add-module',
  AddModel = 'add-model',
  EditModel = 'edit-model',
}

export type AddModule = {
  readonly type: ModelingCommandType.AddModule;
  readonly moduleName: string;
  readonly language: Language;
};

export type AddModel = {
  readonly type: ModelingCommandType.AddModel;
  readonly modelName: string;
  readonly language: Language;
};

export type EditModel = {
  readonly type: ModelingCommandType.EditModel;
};
