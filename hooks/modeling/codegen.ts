import { useMemo } from 'react';
import { useModel, useSystemModels } from './queries';
import { generateTypeScriptCode, getModelFilePath } from '@/models/modeling/codegen/typescript';
import { generatePythonCode, getPythonModelFilePath } from '@/models/modeling/codegen/python';
import { CodeFile, CodegenLanguage } from '@/models/modeling/codegen/types';
import { ModelId } from '@/models/modeling/values';

export function useModelCodeFile(
  modelId: ModelId,
  language: CodegenLanguage,
): { codeFile: CodeFile | null; isLoading: boolean } {
  const { model, isLoading: isLoadingModel } = useModel(modelId);
  const { models: allModels, isLoading: isLoadingModels } = useSystemModels(model?.systemId ?? null);

  const codeFile = useMemo(() => {
    if (!model || allModels.length === 0) return null;
    switch (language) {
      case 'typescript':
        return { path: getModelFilePath(model), code: generateTypeScriptCode(model, allModels) };
      case 'python':
        return { path: getPythonModelFilePath(model), code: generatePythonCode(model, allModels) };
    }
  }, [model, allModels, language]);

  return { codeFile, isLoading: isLoadingModel || isLoadingModels };
}
