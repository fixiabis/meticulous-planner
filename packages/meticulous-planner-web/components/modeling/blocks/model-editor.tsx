'use client';

import { useState } from 'react';
import { useModelCommands } from '@/hooks/modeling/use-model-commands';
import { useModel } from '@/hooks/modeling/queries';
import { cn } from '@/lib/utils';
import { Language, ModelId } from '@/models/modeling/values';
import { ModelChineseView } from '../views/model-chinese-view';
import { ModelEnglishView } from '../views/model-english-view';
import { ModelTechnicalView } from '../views/model-technical-view';

export type ModelEditorProps = {
  className?: string;
  modelId: ModelId;
};

const LANGUAGE_TABS = [
  { value: Language.Chinese, label: '中文' },
  { value: Language.English, label: '英文' },
  { value: Language.Technical, label: 'Technical' },
] as const;

export function ModelEditor({ className, modelId }: ModelEditorProps) {
  const [language, setLanguage] = useState<Language>(Language.Chinese);
  const { model } = useModel(modelId);
  const commands = useModelCommands();

  if (!model) {
    return <div className={cn('p-4', className)} />;
  }

  return (
    <div className={cn('p-4 space-y-4', className)}>
      {/* Language switcher */}
      <div className="flex gap-1 border-b pb-2">
        {LANGUAGE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setLanguage(tab.value)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              language === tab.value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Language-specific view */}
      {language === Language.Chinese && (
        <ModelChineseView modelId={modelId} model={model} commands={commands} />
      )}
      {language === Language.English && (
        <ModelEnglishView modelId={modelId} model={model} commands={commands} />
      )}
      {language === Language.Technical && (
        <ModelTechnicalView model={model} />
      )}
    </div>
  );
}
