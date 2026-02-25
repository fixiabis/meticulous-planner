import { Select } from '@/components/base/select';
import { SystemType } from '@/models/modeling/values';

export type SystemTypeSelectProps = {
  className?: string;
  value: SystemType;
  onChange?: (value: SystemType) => void;
};

export function SystemTypeSelect(props: SystemTypeSelectProps) {
  return (
    <Select
      value={props.value}
      onChange={(value) => value && props.onChange?.(value)}
      items={items}
      valueStringify={String}
    ></Select>
  );
}

const items = [
  { value: SystemType.Core, label: '核心' },
  { value: SystemType.Support, label: '支援型' },
  { value: SystemType.Integration, label: '整合型' },
  { value: SystemType.Generic, label: '基底型' },
];
