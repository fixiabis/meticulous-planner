'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslateModelToTechnical } from '@/hooks/modeling/translation';
import { cn } from '@/lib/utils';
import { ModelId } from '@/models/modeling/values';

export type CodeViewerProps = {
  className?: string;
  modelId?: ModelId;
  filePath?: string;
  code?: string;
};

export function CodeViewer({ className, modelId, filePath, code }: CodeViewerProps) {
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const { translate, isPending } = useTranslateModelToTechnical(modelId ?? null);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b shrink-0">
        <span className="text-xs text-muted-foreground font-mono">{filePath ?? '(尚未命名)'}</span>
        {modelId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!hasApiKey || isPending}
                  onClick={() => translate()}
                >
                  {isPending ? '翻譯中...' : '翻譯名稱'}
                </Button>
              </span>
            </TooltipTrigger>
            {!hasApiKey && (
              <TooltipContent>
                請在 .env.local 設定 NEXT_PUBLIC_GEMINI_API_KEY 以啟用翻譯功能
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </div>
      {code ? (
        <div className="flex-1 overflow-auto bg-muted">
          <pre className="p-4 text-sm font-mono leading-relaxed whitespace-pre">
            <code>{code}</code>
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
