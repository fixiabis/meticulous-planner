export enum StickyNoteType {
  EventTerm = 'event-term',
  CommandTerm = 'command-term',
  ActorTerm = 'actor-term',
  Policy = 'policy',
  ReadModelTerm = 'read-model-term',
  AggregateTerm = 'aggregate-term',
  ExternalSystemTerm = 'external-system-term',
  UiTerm = 'ui-term',
  Question = 'question',
  Comment = 'comment',
}

export const StickyNoteBgClassName: Record<StickyNoteType, string> = {
  [StickyNoteType.EventTerm]: 'bg-orange-300',
  [StickyNoteType.CommandTerm]: 'bg-blue-300',
  [StickyNoteType.ReadModelTerm]: 'bg-green-300',
  [StickyNoteType.AggregateTerm]: 'bg-yellow-400',
  [StickyNoteType.ActorTerm]: 'bg-yellow-200',
  [StickyNoteType.ExternalSystemTerm]: 'bg-pink-300',
  [StickyNoteType.UiTerm]: 'bg-gray-200',
  [StickyNoteType.Policy]: 'bg-violet-300',
  [StickyNoteType.Question]: 'bg-red-400',
  [StickyNoteType.Comment]: 'bg-yellow-100',
};

export const StickyNoteSize: Record<StickyNoteType, [number, number]> = {
  [StickyNoteType.EventTerm]: [288, 144],
  [StickyNoteType.CommandTerm]: [288, 144],
  [StickyNoteType.ReadModelTerm]: [288, 144],
  [StickyNoteType.AggregateTerm]: [192, 96],
  [StickyNoteType.ActorTerm]: [96, 96],
  [StickyNoteType.ExternalSystemTerm]: [192, 96],
  [StickyNoteType.UiTerm]: [192, 96],
  [StickyNoteType.Policy]: [288, 144],
  [StickyNoteType.Question]: [192, 96],
  [StickyNoteType.Comment]: [192, 96],
};

export const StickyNoteLabel: Record<StickyNoteType, string> = {
  [StickyNoteType.EventTerm]: '事件',
  [StickyNoteType.CommandTerm]: '指令',
  [StickyNoteType.ReadModelTerm]: '讀取模型',
  [StickyNoteType.AggregateTerm]: '聚合',
  [StickyNoteType.ActorTerm]: '角色',
  [StickyNoteType.ExternalSystemTerm]: '外部系統',
  [StickyNoteType.UiTerm]: '介面',
  [StickyNoteType.Policy]: '原則',
  [StickyNoteType.Question]: '問題',
  [StickyNoteType.Comment]: '註解',
};

export const StickyNotePlaceholder: Record<StickyNoteType, string> = {
  [StickyNoteType.EventTerm]: '用過去動詞寫\n「什麼已發生」',
  [StickyNoteType.CommandTerm]: '寫「做什麼」\n使事件發生？',
  [StickyNoteType.ReadModelTerm]: '看「什麼資訊」做？',
  [StickyNoteType.AggregateTerm]: '會改「什麼」？',
  [StickyNoteType.ActorTerm]: '「誰」做？',
  [StickyNoteType.ExternalSystemTerm]: '會用「什麼」？',
  [StickyNoteType.UiTerm]: '查看或操作「什麼」？',
  [StickyNoteType.Policy]: '什麼已發生時\n做什麼？',
  [StickyNoteType.Question]: '哪裡怪怪的？',
  [StickyNoteType.Comment]: '哪裡需要補充？',
};

export const StickyNoteClassName: Record<StickyNoteType, string> = {
  [StickyNoteType.EventTerm]: 'w-72 [&,&>*]:min-h-36 text-2xl',
  [StickyNoteType.CommandTerm]: 'w-72 [&,&>*]:min-h-36 text-2xl',
  [StickyNoteType.ReadModelTerm]: 'w-72 [&,&>*]:min-h-36 text-2xl',
  [StickyNoteType.AggregateTerm]: 'w-48 [&,&>*]:min-h-24 text-xl',
  [StickyNoteType.ActorTerm]: 'w-24 [&,&>*]:min-h-24 text-base',
  [StickyNoteType.ExternalSystemTerm]: 'w-48 [&,&>*]:min-h-24 text-xl',
  [StickyNoteType.UiTerm]: 'w-48 [&,&>*]:min-h-24 text-xl',
  [StickyNoteType.Policy]: 'w-72 [&,&>*]:min-h-36 text-2xl',
  [StickyNoteType.Question]: 'w-48 [&,&>*]:min-h-36 text-xl',
  [StickyNoteType.Comment]: 'w-48 [&,&>*]:min-h-36 text-lg',
};

export const EventStormingTypes: StickyNoteType[] = [
  StickyNoteType.EventTerm,
  StickyNoteType.CommandTerm,
  StickyNoteType.ActorTerm,
  StickyNoteType.Policy,
  StickyNoteType.ReadModelTerm,
  StickyNoteType.AggregateTerm,
  StickyNoteType.ExternalSystemTerm,
  StickyNoteType.UiTerm,
  StickyNoteType.Question,
  StickyNoteType.Comment,
];
