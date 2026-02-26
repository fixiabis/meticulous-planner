import { Select } from '@/components/base/select';
import { Language, Multiplicity } from '@/models/modeling/values';

export type MultiplicitySelectProps = {
  className?: string;
  language: Language;
  value: Multiplicity;
  onChange?: (value: Multiplicity) => void;
};

export function MultiplicitySelect(props: MultiplicitySelectProps) {
  const labels = LABELS[props.language] ?? LABELS[Language.Chinese];
  const items = MULTIPLICITY_ORDER.map((v) => ({ value: v, label: labels[v] }));
  return (
    <Select
      value={props.value}
      onChange={(value) => value && props.onChange?.(value)}
      items={items}
    />
  );
}

const MULTIPLICITY_ORDER: Multiplicity[] = [
  Multiplicity.Single,
  Multiplicity.Optional,
  Multiplicity.Multiple,
  Multiplicity.AtLeastOne,
];

const LABELS: Record<Language, Record<Multiplicity, string>> = {
  [Language.Chinese]: {
    [Multiplicity.Single]: '固定一個的',
    [Multiplicity.Optional]: '至多一個的',
    [Multiplicity.Multiple]: '數量不限的',
    [Multiplicity.AtLeastOne]: '至少一個的',
  },
  [Language.English]: {
    [Multiplicity.Single]: 'single',
    [Multiplicity.Optional]: 'optional',
    [Multiplicity.Multiple]: 'any number of',
    [Multiplicity.AtLeastOne]: 'one or more',
  },
  [Language.Technical]: {
    [Multiplicity.Single]: 'single',
    [Multiplicity.Optional]: 'optional',
    [Multiplicity.Multiple]: 'any number of',
    [Multiplicity.AtLeastOne]: 'one-or-more',
  },
};
