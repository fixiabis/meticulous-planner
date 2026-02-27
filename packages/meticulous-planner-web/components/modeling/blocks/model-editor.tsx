'use client';

import { useState } from 'react';
import { useModelCommands } from '@/hooks/modeling/use-model-commands';
import { useModel } from '@/hooks/modeling/queries';
import { useTranslateModelToTechnical } from '@/hooks/modeling/translation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Language, ModelId } from '@/models/modeling/values';
import { ModelChineseView } from '../views/model-chinese-view';
import { ModelEnglishView } from '../views/model-english-view';
import { ModelTechnicalView } from '../views/model-technical-view';

export type ModelEditorProps = {
  className?: string;
  modelId: ModelId;
};

export function ModelEditor({ className, modelId }: ModelEditorProps) {
  const [language, setLanguage] = useState<Language>(Language.Chinese);
  const { model } = useModel(modelId);
  const commands = useModelCommands();
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const { translate, isPending } = useTranslateModelToTechnical(modelId);
  const labels = LABELS[language];
  const languageTabs = [
    { value: Language.Chinese, label: labels.tabChinese },
    { value: Language.English, label: labels.tabEnglish },
    { value: Language.Technical, label: labels.tabTechnical },
  ];

  if (!model) {
    return <div className={cn('p-4', className)} />;
  }

  return (
    <div className={cn('p-4 space-y-4', className)}>
      {/* Language switcher */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex gap-1">
          {languageTabs.map((tab) => (
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
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                size="sm"
                variant="outline"
                disabled={!hasApiKey || isPending}
                onClick={() => translate()}
              >
                {isPending ? labels.translating : labels.translate}
              </Button>
            </span>
          </TooltipTrigger>
          {!hasApiKey && (
            <TooltipContent>
              請在 .env.local 設定 NEXT_PUBLIC_GEMINI_API_KEY 以啟用翻譯功能
            </TooltipContent>
          )}
        </Tooltip>
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

type Labels = {
  tabChinese: string;
  tabEnglish: string;
  tabTechnical: string;
  translate: string;
  translating: string;
};

const LABELS: Record<Language, Labels> = {
  [Language.Chinese]: {
    tabChinese: '中文',
    tabEnglish: '英文',
    tabTechnical: 'Technical',
    translate: '翻譯名稱',
    translating: '翻譯中...',
  },
  [Language.English]: {
    tabChinese: 'Chinese',
    tabEnglish: 'English',
    tabTechnical: 'Technical',
    translate: 'Translate',
    translating: 'Translating...',
  },
  [Language.Technical]: {
    tabChinese: 'zh',
    tabEnglish: 'en',
    tabTechnical: 'tech',
    translate: 'translate',
    translating: 'translating...',
  },
};
