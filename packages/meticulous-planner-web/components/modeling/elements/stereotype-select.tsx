import { Select } from '@/components/base/select';
import { Language, Stereotype } from '@/models/modeling/values';

export type StereotypeSelectProps = {
  className?: string;
  language: Language;
  value: Stereotype;
  onChange?: (value: Stereotype) => void;
};

export function StereotypeSelect(props: StereotypeSelectProps) {
  const labels = LABELS[props.language] ?? LABELS[Language.Chinese];
  const items = STEREOTYPE_ORDER.map((v) => ({ value: v, label: labels[v] }));
  return (
    <Select
      value={props.value}
      onChange={(value) => value && props.onChange?.(value)}
      items={items}
    />
  );
}

const STEREOTYPE_ORDER: Stereotype[] = [
  Stereotype.Actor,
  Stereotype.ExternalSystem,
  Stereotype.Command,
  Stereotype.Event,
  Stereotype.Error,
  Stereotype.Query,
  Stereotype.ReadModel,
  Stereotype.AggregateRoot,
  Stereotype.Entity,
  Stereotype.ValueObject,
  Stereotype.Enumeration,
];

const LABELS: Record<Language, Record<Stereotype, string>> = {
  [Language.Chinese]: {
    [Stereotype.Actor]: '身份',
    [Stereotype.ExternalSystem]: '外部系統',
    [Stereotype.Command]: '指令',
    [Stereotype.Event]: '事件',
    [Stereotype.Error]: '錯誤',
    [Stereotype.Query]: '查詢',
    [Stereotype.ReadModel]: '資訊',
    [Stereotype.AggregateRoot]: '記錄',
    [Stereotype.Entity]: '記錄項目',
    [Stereotype.ValueObject]: '格式',
    [Stereotype.Enumeration]: '種類',
    [Stereotype.DomainService]: '領域服務',
    [Stereotype.Application]: '應用',
  },
  [Language.English]: {
    [Stereotype.Actor]: 'Role',
    [Stereotype.ExternalSystem]: 'External System',
    [Stereotype.Command]: 'Command',
    [Stereotype.Event]: 'Event',
    [Stereotype.Error]: 'Error',
    [Stereotype.Query]: 'Query',
    [Stereotype.ReadModel]: 'Report',
    [Stereotype.AggregateRoot]: 'Record',
    [Stereotype.Entity]: 'Record Entry',
    [Stereotype.ValueObject]: 'Format',
    [Stereotype.Enumeration]: 'Category',
    [Stereotype.DomainService]: 'Service',
    [Stereotype.Application]: 'Application',
  },
  [Language.Technical]: {
    [Stereotype.Actor]: 'actor',
    [Stereotype.ExternalSystem]: 'external-system',
    [Stereotype.Command]: 'command',
    [Stereotype.Event]: 'event',
    [Stereotype.Error]: 'error',
    [Stereotype.Query]: 'query',
    [Stereotype.ReadModel]: 'read-model',
    [Stereotype.AggregateRoot]: 'aggregate-root',
    [Stereotype.Entity]: 'entity',
    [Stereotype.ValueObject]: 'value-object',
    [Stereotype.Enumeration]: 'enumeration',
    [Stereotype.DomainService]: 'domain-service',
    [Stereotype.Application]: 'application',
  },
};
