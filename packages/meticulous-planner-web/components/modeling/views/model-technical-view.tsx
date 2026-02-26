'use client';

import { Model } from '@/models/modeling/model';
import { Language, Stereotype } from '@/models/modeling/values';

export type ModelTechnicalViewProps = {
  model: Model;
};

function getTechnicalName(desc: Readonly<Partial<Record<Language, { name: string }>>>, fallback = ''): string {
  return desc[Language.Technical]?.name || fallback;
}

const STEREOTYPE_LABEL: Record<Stereotype, string> = {
  [Stereotype.AggregateRoot]: 'aggregate-root',
  [Stereotype.Entity]: 'entity',
  [Stereotype.ValueObject]: 'value-object',
  [Stereotype.Command]: 'command',
  [Stereotype.Event]: 'event',
  [Stereotype.Query]: 'query',
  [Stereotype.ReadModel]: 'read-model',
  [Stereotype.Actor]: 'actor',
  [Stereotype.Error]: 'error',
  [Stereotype.ExternalSystem]: 'external-system',
  [Stereotype.DomainService]: 'domain-service',
  [Stereotype.Enumeration]: 'enumeration',
  [Stereotype.Application]: 'application',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm font-mono">
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span>{value || <span className="text-muted-foreground/50 italic">—</span>}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-3">{title}</p>
      {children}
    </div>
  );
}

export function ModelTechnicalView({ model }: ModelTechnicalViewProps) {
  const modelName = getTechnicalName(model.descriptions);
  const stereotypeLabel = STEREOTYPE_LABEL[model.stereotype] ?? model.stereotype;

  return (
    <div className="space-y-2 font-mono text-sm">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{modelName || <span className="text-muted-foreground italic">—</span>}</span>
        <span className="text-xs text-muted-foreground border rounded px-1.5 py-0.5">{stereotypeLabel}</span>
      </div>

      {model.typeParameters.length > 0 && (
        <Section title="type parameters">
          {model.typeParameters.map((tp) => (
            <Row key={tp.id} label={`  ${tp.id.slice(0, 6)}…`} value={getTechnicalName(tp.descriptions)} />
          ))}
        </Section>
      )}

      {model.attributes.length > 0 && (
        <Section title="attributes">
          {model.attributes.map((attr) => (
            <Row key={attr.id} label={`  ${getTechnicalName(attr.descriptions) || '—'}`} value={attr.multiplicity} />
          ))}
        </Section>
      )}

      {model.operations.length > 0 && (
        <Section title="operations">
          {model.operations.map((op) => {
            const paramNames = op.parameters.map((p) => getTechnicalName(p.descriptions) || '—').join(', ');
            const signature = `${getTechnicalName(op.descriptions) || '—'}(${paramNames})`;
            return <Row key={op.id} label={`  ${signature}`} value={op.returnMultiplicity} />;
          })}
        </Section>
      )}

      {model.stereotype === Stereotype.Enumeration && model.enumerationItems.length > 0 && (
        <Section title="enumeration items">
          {model.enumerationItems.map((item) => (
            <Row key={item.id} label={`  ${getTechnicalName(item.descriptions) || '—'}`} value={item.code} />
          ))}
        </Section>
      )}

      {modelName === '' && (
        <p className="text-muted-foreground text-sm mt-4">
          尚未有 Technical 名稱。請切換至「英文」模式輸入英文名稱，或點「翻譯名稱」讓 AI 自動翻譯。
        </p>
      )}
    </div>
  );
}
