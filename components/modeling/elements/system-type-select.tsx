import { Select } from '@/components/base/select';
import { Language, SystemType } from '@/models/modeling/values';

export type SystemTypeSelectProps = {
  className?: string;
  language?: Language;
  value: SystemType;
  onChange?: (value: SystemType) => void;
};

export function SystemTypeSelect(props: SystemTypeSelectProps) {
  const labels = LABELS[props.language ?? Language.Chinese];
  const items = SYSTEM_TYPE_ORDER.map((v) => ({ value: v, label: labels[v] }));
  return (
    <Select
      value={props.value}
      onChange={(value) => value && props.onChange?.(value)}
      items={items}
    />
  );
}

const SYSTEM_TYPE_ORDER: SystemType[] = [
  SystemType.Core,
  SystemType.Support,
  SystemType.Integration,
  SystemType.Generic,
];

const LABELS: Record<Language, Record<SystemType, string>> = {
  [Language.Chinese]: {
    [SystemType.Core]: '核心',
    [SystemType.Support]: '支援型',
    [SystemType.Integration]: '整合型',
    [SystemType.Generic]: '通用型',
  },
  [Language.English]: {
    [SystemType.Core]: 'core',
    [SystemType.Support]: 'supporting',
    [SystemType.Integration]: 'integration',
    [SystemType.Generic]: 'generic',
  },
  [Language.Technical]: {
    [SystemType.Core]: 'core',
    [SystemType.Support]: 'supporting',
    [SystemType.Integration]: 'integration',
    [SystemType.Generic]: 'generic',
  },
};
