'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ContentEditable } from '@/components/base/content-editable';
import { DropdownMenu } from '@/components/base/dropdown-menu';
import { useProject, useProjectSystems } from '@/hooks/modeling/queries';
import { useAddSystem, useRenameSystem } from '@/hooks/modeling/system-commands';
import { Language, ProjectId } from '@/models/modeling/values';

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId: projectIdStr } = use(params);
  const projectId = ProjectId(projectIdStr);

  const router = useRouter();
  const { project } = useProject(projectId);
  const { systems } = useProjectSystems(projectId);
  const { addSystem } = useAddSystem();
  const { renameSystem } = useRenameSystem();

  const handleAddSystem = async () => {
    const system = await addSystem({
      projectId,
      name: '',
      language: Language.Chinese,
    });
    router.push(`/systems/${system.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-1">
      <h1 className="text-2xl font-bold mb-2">
        {project?.descriptions[Language.Chinese]?.name || '未命名專案'}
      </h1>
      <p className="group/systems">
        {systems.length === 0 ? '暫無任何系統' : '目前已建立以下系統：'}
        <DropdownMenu items={[{ label: '新增系統', onSelect: handleAddSystem }]}>
          <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/systems:opacity-100">
            {' '}
            ...
          </span>
        </DropdownMenu>
      </p>
      {systems.length > 0 && (
        <ul className="list-disc list-outside pl-6">
          {systems.map((system) => (
            <li key={system.id} className="relative group/system">
              <ContentEditable
                content={system.descriptions[Language.Chinese]?.name ?? ''}
                placeholder="未命名系統"
                onContentChange={(name) => {
                  if (name.trim() !== '') {
                    renameSystem({ systemId: system.id, name, language: Language.Chinese });
                  }
                }}
              />
              <DropdownMenu
                items={[
                  {
                    label: '進入系統',
                    onSelect: () => router.push(`/systems/${system.id}`),
                  },
                  { label: '新增系統', onSelect: handleAddSystem },
                ]}
              >
                <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/system:opacity-100">
                  {' '}
                  ...
                </span>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
