'use client';

import { useRouter } from 'next/navigation';
import { useSystems } from '@/hooks/modeling/queries';
import { useAddSystem } from '@/hooks/modeling/system-commands';
import { Language, SystemId } from '@/models/modeling/values';
import { Button } from '@/components/ui/button';

export default function Page() {
  const router = useRouter();
  const { systems, isLoading } = useSystems();
  const { addSystem, isPending } = useAddSystem();

  const handleAddSystem = async () => {
    const system = await addSystem({
      systemId: SystemId(crypto.randomUUID()),
      name: '新系統',
      language: Language.Chinese,
    });
    router.push(`/systems/${system.id}`);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">載入中...</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">選擇系統</h1>
      <div className="flex flex-col gap-2 w-64">
        {systems.map((system) => (
          <Button
            key={system.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push(`/systems/${system.id}`)}
          >
            {system.descriptions[Language.Chinese]?.name || '未命名系統'}
          </Button>
        ))}
        <Button onClick={handleAddSystem} disabled={isPending}>
          + 新增系統
        </Button>
      </div>
    </div>
  );
}
