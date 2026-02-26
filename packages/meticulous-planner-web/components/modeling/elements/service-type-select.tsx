import { Select } from '@/components/base/select';
import { ServiceType } from '@/models/modeling/values';

export type ServiceTypeSelectProps = {
  className?: string;
  value: ServiceType;
  onChange?: (value: ServiceType) => void;
};

export function ServiceTypeSelect(props: ServiceTypeSelectProps) {
  return (
    <Select
      value={props.value}
      onChange={(value) => value && props.onChange?.(value)}
      items={items}
    ></Select>
  );
}

const items = [
  { value: ServiceType.Core, label: '核心' },
  { value: ServiceType.Adapter, label: '支援' },
];
