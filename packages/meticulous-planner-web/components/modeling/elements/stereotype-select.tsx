import { Select } from '@/components/base/select';
import { Language, Stereotype } from '@/models/modeling/values';

export type StereotypeSelectProps = {
  className?: string;
  language: Language;
  value: Stereotype;
  onChange?: (value: Stereotype) => void;
};

export function StereotypeSelect(props: StereotypeSelectProps) {
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
  { value: Stereotype.Actor, label: '身份' },
  // { value: Stereotype.Application, label: '應用' },
  // { value: Stereotype.DomainService, label: '領域服務' },

  { value: Stereotype.ExternalSystem, label: '外部系統' },

  { value: Stereotype.Command, label: '指令' },
  { value: Stereotype.Event, label: '事件' },
  { value: Stereotype.Error, label: '錯誤' },

  { value: Stereotype.Query, label: '查詢' },
  { value: Stereotype.ReadModel, label: '資訊' },

  { value: Stereotype.AggregateRoot, label: '記錄' },
  { value: Stereotype.Entity, label: '記錄項目' },
  { value: Stereotype.ValueObject, label: '格式' },

  { value: Stereotype.Enumeration, label: '分類' },
];
