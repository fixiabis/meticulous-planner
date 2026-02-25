'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ModelEditor } from '@/components/modeling/blocks/model-editor';
import { CodeViewer } from '@/components/modeling/elements/code-viewer';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useModel, useSystemModels } from '@/hooks/modeling/queries';
import { generateTypeScriptCode, getModelFilePath } from '@/models/modeling/codegen/typescript';
import { ModelId, SystemId } from '@/models/modeling/values';

export default function ModelPage({
  params,
}: {
  params: Promise<{ systemId: string; modelId: string }>;
}) {
  const { systemId: systemIdStr, modelId: modelIdStr } = use(params);

  const systemId = SystemId(systemIdStr);
  const modelId = ModelId(modelIdStr);

  const router = useRouter();
  const { model } = useModel(modelId);
  const { models: allModels } = useSystemModels(systemId);

  const code = model && allModels.length > 0 ? generateTypeScriptCode(model, allModels) : undefined;
  const filePath = model ? getModelFilePath(model) : undefined;

  return (
    <div className="flex flex-col h-screen">
      <div className="p-3 border-b shrink-0">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          ← 返回
        </Button>
      </div>
      <ResizablePanelGroup className="flex-1">
        <ResizablePanel defaultSize={50}>
          <ScrollArea className="h-full">
            <ModelEditor modelId={modelId} />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <CodeViewer modelId={modelId} filePath={filePath} code={code} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
