import { Description } from './description';
import { Model } from './model';
import { Module } from './module';
import { TypeParameter } from './type-parameter';
import { Language, ModelId, ModuleId, ProjectId, Stereotype, TypeParameterId } from './values';

export function buildBaseModule(projectId: ProjectId) {
  return Module.create({ id: ModuleId('base'), projectId: projectId, isBase: true });
}

export function buildBaseModels(projectId: ProjectId) {
  return [
    Model.create({
      id: ModelId('base-string'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '文字', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-integer'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '整數', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-decimal'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: {
        [Language.Chinese]: Description.create({ name: '有小數點的數字', language: Language.Chinese }),
      },
    }),
    Model.create({
      id: ModelId('base-boolean'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '是或否', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-date'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '日期', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-datetime'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '日期時間', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-time'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: { [Language.Chinese]: Description.create({ name: '時間', language: Language.Chinese }) },
    }),
    Model.create({
      id: ModelId('base-awaitable'),
      projectId: projectId,
      moduleId: ModuleId('base'),
      stereotype: Stereotype.ValueObject,
      descriptions: {
        [Language.Chinese]: Description.create({ name: '需等待的模型', language: Language.Chinese }),
      },
      typeParameters: [
        TypeParameter.create({
          id: TypeParameterId('base-awaitable-item'),
          descriptions: {
            [Language.Chinese]: Description.create({ name: '等待的模型', language: Language.Chinese }),
          },
        }),
      ],
    }),
  ];
}
