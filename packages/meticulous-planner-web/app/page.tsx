'use client';

import { useRouter } from 'next/navigation';
import { ContentEditable } from '@/components/base/content-editable';
import { DropdownMenu } from '@/components/base/dropdown-menu';
import { useProjects } from '@/hooks/modeling/queries';
import { useAddProject, useRenameProject } from '@/hooks/modeling/project-commands';
import { Language, ProjectId } from '@/models/modeling/values';

export default function Page() {
  const router = useRouter();
  const { projects } = useProjects();
  const { addProject } = useAddProject();
  const { renameProject } = useRenameProject();

  const handleAddProject = async () => {
    const project = await addProject({
      projectId: ProjectId(crypto.randomUUID()),
      name: '',
      language: Language.Chinese,
    });
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-1">
      <h1 className="text-2xl font-bold mb-2">各專案</h1>
      <p className="group/projects">
        {projects.length === 0 ? '暫無任何專案' : '目前已建立以下專案：'}
        <DropdownMenu items={[{ label: '新增專案', onSelect: handleAddProject }]}>
          <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/projects:opacity-100">
            {' '}
            ...
          </span>
        </DropdownMenu>
      </p>
      {projects.length > 0 && (
        <ul className="list-disc list-outside pl-6">
          {projects.map((project) => (
            <li key={project.id} className="relative group/project">
              <ContentEditable
                content={project.descriptions[Language.Chinese]?.name ?? ''}
                placeholder="未命名專案"
                onContentChange={(name) => {
                  if (name.trim() !== '') {
                    renameProject({ projectId: project.id, name, language: Language.Chinese });
                  }
                }}
              />
              <DropdownMenu
                items={[
                  {
                    label: '進入專案',
                    onSelect: () => router.push(`/projects/${project.id}`),
                  },
                  { label: '新增專案', onSelect: handleAddProject },
                ]}
              >
                <span className="cursor-pointer text-muted-foreground opacity-0 group-hover/project:opacity-100">
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
