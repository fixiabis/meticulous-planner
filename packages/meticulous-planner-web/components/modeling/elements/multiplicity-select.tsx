import { Select } from '@/components/base/select';
import { Language, Multiplicity } from '@/models/modeling/values';

export type MultiplicitySelectProps = {
  className?: string;
  language: Language;
  value: Multiplicity;
  onChange?: (value: Multiplicity) => void;
};

export function MultiplicitySelect(props: MultiplicitySelectProps) {
  return (
    <Select
      value={props.value}
      onChange={(value) => value && props.onChange?.(value)}
      items={items}
    ></Select>
  );
}

const items = [
  { value: Multiplicity.Single, label: '固定一個的' },
  { value: Multiplicity.Optional, label: '至多一個的' },
  { value: Multiplicity.Multiple, label: '數量不限的' },
  { value: Multiplicity.AtLeastOne, label: '至少一個的' },
];
