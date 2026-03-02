'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useModelCodeFile } from '@/hooks/modeling/codegen';
import { CodegenLanguage } from '@/models/modeling/codegen/types';
import { ModelId } from '@/models/modeling/values';

export type CodeViewerProps = {
  className?: string;
  modelId: ModelId;
};

export function CodeViewer({ className, modelId }: CodeViewerProps) {
  const [lang, setLang] = useState<CodegenLanguage>('typescript');
  const { codeFile } = useModelCodeFile(modelId, lang);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex shrink-0">
            <Button
              size="sm"
              variant={lang === 'typescript' ? 'default' : 'ghost'}
              className="rounded-r-none h-6 px-2 text-xs"
              onClick={() => setLang('typescript')}
            >
              TypeScript
            </Button>
            <Button
              size="sm"
              variant={lang === 'python' ? 'default' : 'ghost'}
              className="rounded-l-none h-6 px-2 text-xs border-l"
              onClick={() => setLang('python')}
            >
              Python
            </Button>
          </div>
          <span className="text-xs text-muted-foreground font-mono truncate">
            {codeFile?.path ?? '(unknown)'}
          </span>
        </div>
      </div>
      {codeFile?.code ? (
        <div className="flex-1 overflow-auto bg-muted">
          <pre className="p-4 text-sm font-mono leading-relaxed whitespace-pre">
            <code>{codeFile.code}</code>
          </pre>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          (尚無程式碼)
        </div>
      )}
    </div>
  );
}
