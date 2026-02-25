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

export function useTranslateModelToTechnical(modelId: ModelId | null) {
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

      const prompt = `You are a software engineer translating Chinese domain model names into TypeScript-friendly technical identifiers.

Given the following domain model in Chinese, translate all names to English technical identifiers:
- modelName → PascalCase (e.g., "訂單" → "Order", "訂單聚合根" → "OrderAggregate")
- typeParameter names → PascalCase (e.g., "項目" → "Item")
- attribute names → camelCase (e.g., "顧客編號" → "customerId", "總金額" → "totalAmount")
- operation names → camelCase (e.g., "下訂單" → "placeOrder", "計算總金額" → "calculateTotal")
- parameter names → camelCase
- enumerationItem names → PascalCase (e.g., "待處理" → "Pending", "已確認" → "Confirmed")
- enumerationItem codes → keep existing code if non-empty, otherwise generate snake_case (e.g., "pending", "confirmed")

Input:
${JSON.stringify(inputData, null, 2)}

Return ONLY a valid JSON object with the exact same structure, with all names translated to English technical identifiers. Preserve the id fields exactly as provided. Do not include any explanation or markdown.`;

      const resultText = await callGemini(prompt, apiKey);
      const result: TranslationResult = JSON.parse(resultText);

      const renameModelCmd: RenameModel = {
        type: ModelingCommandType.RenameModel,
        modelId: model.id,
        name: result.modelName,
        language: Language.Technical,
      };
      await modelingService.renameModel(renameModelCmd);

      for (const tp of result.typeParameters) {
        const cmd: RenameModelTypeParameter = {
          type: ModelingCommandType.RenameModelTypeParameter,
          modelId: model.id,
          typeParameterId: TypeParameterId(tp.id),
          name: tp.name,
          language: Language.Technical,
        };
        await modelingService.renameModelTypeParameter(cmd);
      }

      for (const attr of result.attributes) {
        const cmd: RenameModelAttribute = {
          type: ModelingCommandType.RenameModelAttribute,
          modelId: model.id,
          attributeId: AttributeId(attr.id),
          name: attr.name,
          language: Language.Technical,
        };
        await modelingService.renameModelAttribute(cmd);
      }

      for (const op of result.operations) {
        const opCmd: RenameModelOperation = {
          type: ModelingCommandType.RenameModelOperation,
          modelId: model.id,
          operationId: OperationId(op.id),
          name: op.name,
          language: Language.Technical,
        };
        await modelingService.renameModelOperation(opCmd);

        for (const param of op.parameters) {
          const paramCmd: RenameModelOperationParameter = {
            type: ModelingCommandType.RenameModelOperationParameter,
            modelId: model.id,
            operationId: OperationId(op.id),
            parameterId: ParameterId(param.id),
            name: param.name,
            language: Language.Technical,
          };
          await modelingService.renameModelOperationParameter(paramCmd);
        }
      }

      for (const item of result.enumerationItems) {
        const itemCmd: RenameModelEnumerationItem = {
          type: ModelingCommandType.RenameModelEnumerationItem,
          modelId: model.id,
          enumerationItemId: EnumerationItemId(item.id),
          name: item.name,
          language: Language.Technical,
        };
        await modelingService.renameModelEnumerationItem(itemCmd);

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
