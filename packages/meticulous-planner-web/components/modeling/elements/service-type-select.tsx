import { Select } from '@/components/base/select';
import { Language, ServiceType } from '@/models/modeling/values';

export type ServiceTypeSelectProps = {
  className?: string;
  language?: Language;
  value: ServiceType;
  onChange?: (value: ServiceType) => void;
};

export function ServiceTypeSelect(props: ServiceTypeSelectProps) {
  const labels = LABELS[props.language ?? Language.Chinese];
  const items = SERVICE_TYPE_ORDER.map((v) => ({ value: v, label: labels[v] }));
  return (
    <Select
      value={props.value}
      onChange={(value) => value && props.onChange?.(value)}
      items={items}
    />
  );
}

const SERVICE_TYPE_ORDER: ServiceType[] = [
  ServiceType.Core,
  ServiceType.Adapter,
];

const LABELS: Record<Language, Record<ServiceType, string>> = {
  [Language.Chinese]: {
    [ServiceType.Core]: '核心',
    [ServiceType.Adapter]: '支援',
  },
  [Language.English]: {
    [ServiceType.Core]: 'core',
    [ServiceType.Adapter]: 'adapter',
  },
  [Language.Technical]: {
    [ServiceType.Core]: 'core',
    [ServiceType.Adapter]: 'adapter',
  },
};
