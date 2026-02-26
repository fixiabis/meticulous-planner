import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ModelingCommandType,
  RenameModel,
  RenameModelAttribute,
  RenameModelEnumerationItem,
  RenameModelOperation,
  RenameModelOperationParameter,
  RenameModelTypeParameter,
} from '@/models/modeling/messages/commands';
import {
  AttributeId,
  EnumerationItemId,
  Language,
  ModelId,
  OperationId,
  ParameterId,
  TypeParameterId,
} from '@/models/modeling/values';
import { toTechnicalName } from '@/lib/naming';
import { useModelingService } from './modeling-service';
import { modelKey, systemModelsKey, useModel } from './queries';

type TranslationResult = {
  modelName: string;
  typeParameters: Array<{ id: string; name: string }>;
  attributes: Array<{ id: string; name: string }>;
  operations: Array<{
    id: string;
    name: string;
    parameters: Array<{ id: string; name: string }>;
  }>;
  enumerationItems: Array<{ id: string; name: string; code: string }>;
};

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function dispatchRename(
  modelingService: ReturnType<typeof useModelingService>,
  cmd: RenameModel | RenameModelAttribute | RenameModelEnumerationItem | RenameModelOperation | RenameModelOperationParameter | RenameModelTypeParameter,
) {
  switch (cmd.type) {
    case ModelingCommandType.RenameModel:
      return modelingService.renameModel(cmd);
    case ModelingCommandType.RenameModelAttribute:
      return modelingService.renameModelAttribute(cmd);
    case ModelingCommandType.RenameModelEnumerationItem:
      return modelingService.renameModelEnumerationItem(cmd);
    case ModelingCommandType.RenameModelOperation:
      return modelingService.renameModelOperation(cmd);
    case ModelingCommandType.RenameModelOperationParameter:
      return modelingService.renameModelOperationParameter(cmd);
    case ModelingCommandType.RenameModelTypeParameter:
      return modelingService.renameModelTypeParameter(cmd);
  }
}

/** Renames a model element in both Language.English and Language.Technical (auto-derived). */
async function renameWithTechnical(
  modelingService: ReturnType<typeof useModelingService>,
  englishCmd: RenameModel | RenameModelAttribute | RenameModelEnumerationItem | RenameModelOperation | RenameModelOperationParameter | RenameModelTypeParameter,
) {
  await dispatchRename(modelingService, englishCmd);
  const technicalCmd = { ...englishCmd, name: toTechnicalName(englishCmd.name), language: Language.Technical };
  await dispatchRename(modelingService, technicalCmd);
}

export function useTranslateModelToEnglish(modelId: ModelId | null) {
  const { model } = useModel(modelId);
  const modelingService = useModelingService();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const translate = async () => {
    if (!model) return;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return;

    setIsPending(true);
    try {
      const inputData = {
        modelName: model.descriptions[Language.Chinese]?.name || model.id,
        typeParameters: model.typeParameters.map((tp) => ({
          id: tp.id,
          name: tp.descriptions[Language.Chinese]?.name || '',
        })),
        attributes: model.attributes.map((a) => ({
          id: a.id,
          name: a.descriptions[Language.Chinese]?.name || '',
        })),
        operations: model.operations.map((op) => ({
          id: op.id,
          name: op.descriptions[Language.Chinese]?.name || '',
          parameters: op.parameters.map((p) => ({
            id: p.id,
            name: p.descriptions[Language.Chinese]?.name || '',
          })),
        })),
        enumerationItems: model.enumerationItems.map((item) => ({
          id: item.id,
          name: item.descriptions[Language.Chinese]?.name || '',
          code: item.code,
        })),
      };

      const prompt = `You are a domain-driven design expert. Translate the following Chinese domain model element names into fluent, natural English.

Rules:
- Translate to natural English words/phrases (NOT camelCase, NOT PascalCase, NOT snake_case)
- Use spaces between words, e.g. "order number", "place order", "customer id"
- Keep names concise and semantically accurate
- enumerationItem codes: keep existing code if non-empty, otherwise generate a short lowercase English word

Input:
${JSON.stringify(inputData, null, 2)}

Return ONLY a valid JSON object with the exact same structure, with all names translated to natural English. Preserve the id fields exactly as provided. Do not include any explanation or markdown.`;

      const resultText = await callGemini(prompt, apiKey);
      const result: TranslationResult = JSON.parse(resultText);

      await renameWithTechnical(modelingService, {
        type: ModelingCommandType.RenameModel,
        modelId: model.id,
        name: result.modelName,
        language: Language.English,
      });

      for (const tp of result.typeParameters) {
        await renameWithTechnical(modelingService, {
          type: ModelingCommandType.RenameModelTypeParameter,
          modelId: model.id,
          typeParameterId: TypeParameterId(tp.id),
          name: tp.name,
          language: Language.English,
        });
      }

      for (const attr of result.attributes) {
        await renameWithTechnical(modelingService, {
          type: ModelingCommandType.RenameModelAttribute,
          modelId: model.id,
          attributeId: AttributeId(attr.id),
          name: attr.name,
          language: Language.English,
        });
      }

      for (const op of result.operations) {
        await renameWithTechnical(modelingService, {
          type: ModelingCommandType.RenameModelOperation,
          modelId: model.id,
          operationId: OperationId(op.id),
          name: op.name,
          language: Language.English,
        });

        for (const param of op.parameters) {
          await renameWithTechnical(modelingService, {
            type: ModelingCommandType.RenameModelOperationParameter,
            modelId: model.id,
            operationId: OperationId(op.id),
            parameterId: ParameterId(param.id),
            name: param.name,
            language: Language.English,
          });
        }
      }

      for (const item of result.enumerationItems) {
        await renameWithTechnical(modelingService, {
          type: ModelingCommandType.RenameModelEnumerationItem,
          modelId: model.id,
          enumerationItemId: EnumerationItemId(item.id),
          name: item.name,
          language: Language.English,
        });

        if (item.code) {
          await modelingService.editModelEnumerationItemCode({
            type: ModelingCommandType.EditModelEnumerationItemCode,
            modelId: model.id,
            enumerationItemId: EnumerationItemId(item.id),
            code: item.code,
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: modelKey(model.id) });
      queryClient.invalidateQueries({ queryKey: systemModelsKey(model.systemId) });
    } finally {
      setIsPending(false);
    }
  };

  return { translate, isPending };
}

// Backward-compat alias
export { useTranslateModelToEnglish as useTranslateModelToTechnical };
