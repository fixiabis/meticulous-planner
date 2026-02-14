# Coding Style Guide — meticulous-planner

## File & Directory

- **Filenames**: `kebab-case.ts` / `kebab-case.tsx`
- **No barrel exports**: No `index.ts`. Import files directly by path.

### Module Structure (`modules/<module-name>/`)

```
entrypoint(s)/   — Public contracts (interface / gateway)
models/
  records/       — Domain entities, value objects, branded types
  messages/      — CQRS messages (commands.ts, events.ts, queries.ts, errors.ts)
  info/          — Read models (query projections)
  procedures/    — Domain services (cross-entity logic)
  dependencies.ts — Store dependency interface declarations
services/        — Contract implementations (implements gateway)
integrations/    — Infrastructure implementations (implements store, etc.)
```

### Component Structure (`components/<feature>/`)

- One folder per feature, containing `.tsx` components, `use-*.ts` hooks, `types.ts`
- Shared base components in `components/base/`

## Imports

- **Cross-module**: `@/` absolute path — `import { Store } from '@/modules/base/entrypoint/store'`
- **Within module**: relative path — `import { TermId } from './values'`
- **Conflict resolution**: alias with `ModuleName_` prefix — `import { Event as Base_Event } from '@/modules/base/models/records/values'`
- **Named imports only**: no wildcard `*` imports
- **Order**:
  1. Cross-module `@/modules/` imports
  2. Third-party packages (`react`, `@xyflow/react`, etc.)
  3. Same-module relative imports

## TypeScript Types

- **`type`** for data structures; **`interface`** for contracts/abstractions
- **No prefixes**: no `I`, `T` prefixes
- **PascalCase** for all type, interface, class, enum names
- **Semantic suffixes**: `Props`, `Store`, `Service`, `Gateway`, `Command`, `Event`, `Query`
- **Props derivation**: use `Pick` / `Omit` / `Partial` composition, not redefinition
  ```typescript
  export type BaseTermProps = Pick<TermProps, 'id' | 'projectId' | 'type' | 'language'> & Partial<TermProps>;
  export type EditTermProps = Partial<Omit<TermProps, 'id' | 'projectId' | 'type' | 'language'>>;
  ```
- **Branded types**: type + same-name factory function
  ```typescript
  export type ProjectId = string & { _type: 'project-id' };
  export const ProjectId = (value: string) => value as ProjectId;
  ```
- **All properties `readonly`**

## Enums

- **PascalCase** name and members
- **Values**: `kebab-case` strings, formatted as `module:action-name` for message types
  ```typescript
  export enum ConceptCommandType {
    AddTerm = 'concept:add-term',
    EditTerm = 'concept:edit-term',
  }
  ```
- **Config enums**: values are plain `kebab-case`
  ```typescript
  export enum StickyNoteType {
    EventTerm = 'event-term',
    CommandTerm = 'command-term',
  }
  ```

## Classes

### Domain Entity (Record)

- All fields `readonly`, assigned in constructor with `??` defaults
- No getters/setters
- Query methods return boolean/value directly
- Mutation methods return a new instance (immutable) and append events
- Core `withProps()` method for immutable updates

```typescript
export class Term {
  readonly id: TermId;
  readonly events: Base_Event[];

  constructor(props: BaseTermProps) {
    this.id = props.id;
    this.events = props.events ?? [];
  }

  isCanonical() { return this.canonicalTermId === null; }

  added(props: BaseTermProps): Term {
    return this.withProps({
      events: [...this.events, new TermAdded(this.projectId, this.id, props)],
    });
  }

  withProps(props: EditTermProps) {
    return new Term({ ...this, ...props, id: this.id });
  }
}
```

### Base Message Hierarchy (`modules/base/models/records/values.ts`)

- `MessageType` branded template literal type + same-name factory function
  ```typescript
  export type MessageType = `${string}:${string}`;
  export const MessageType = (value: string) => value as MessageType;
  ```
- `Message<TMessageType>` base class, constructor uses `public readonly` parameter property
  ```typescript
  export class Message<TMessageType extends MessageType = MessageType> {
    constructor(public readonly type: TMessageType) {}
  }
  ```
- Derived type aliases reuse the base type directly (no new structure)
  ```typescript
  export type EventType = MessageType;
  export const EventType = MessageType;
  ```
- Derived classes inherit from `Message` with narrowed generic
  ```typescript
  export class Event<TEventType extends EventType = EventType> extends Message<TEventType> {}
  export class Command<TCommandType extends CommandType = CommandType> extends Message<TCommandType> {}
  export class Query<TQueryType extends QueryType = QueryType> extends Message<TQueryType> {}
  export class Error<TErrorType extends ErrorType = ErrorType> extends Message<TErrorType> {}
  ```

### CQRS Message (Command / Event / Query)

- Extends base class with enum literal type as generic parameter
- Constructor uses `public readonly` parameter properties
- No logic

```typescript
export class AddTermCommand extends BaseCommand<ConceptCommandType.AddTerm> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly termProps: BaseTermProps,
  ) {
    super(ConceptCommandType.AddTerm);
  }
}
```

### Service (Gateway Implementation)

- Constructor injects dependencies via `private readonly`
- All methods are `async` (even if currently synchronous)
- Methods return `events` array
- Flow: create/get entity → reset events → mutate → persist → return events

```typescript
export class ConceptService implements ConceptGateway {
  constructor(
    private readonly termStore: TermStore,
    private readonly policyStore: PolicyStore,
  ) {}

  async addTerm(command: AddTermCommand) {
    const addedTerm = new Term({ ...command.termProps, id: this.termStore.generateId() })
      .withProps({ events: [] })
      .added(command.termProps);
    this.termStore.put(addedTerm);
    return addedTerm.events;
  }
}
```

### Integration (`integrations/`)

- `implements` the corresponding `entrypoint/` interface, generic parameters must match
  ```typescript
  export class DefaultStore<TItem extends { id: string }, TId extends string = TItem['id']>
    implements Store<TItem, TId> {
  ```
- Constructor injects strategy callbacks (e.g. `loadValues` / `saveValues`)
  ```typescript
  constructor(
    private readonly loadValues: () => Record<string, TItem>,
    private readonly saveValues: (values: Record<string, TItem>) => void,
  ) {
    this.values = loadValues();
  }
  ```
- Internal state managed with `private` + `Readonly<>`
  ```typescript
  private values: Readonly<Record<string, TItem>> = {};
  ```
- State mutations produce a new object via spread, then call save callback
  ```typescript
  this.values = { ...this.values, [value.id as TId]: value };
  this.saveValues(this.values);
  ```

### Provider (Composition Root) (`entrypoints/<module>-gateway-provider.ts`)

- Naming: `<Module>GatewayProvider`
- Located in `entrypoints/` directory
- `async get(): Promise<Gateway>` method assembles Service + Store dependencies
- Is the module's composition root — external consumers obtain the Gateway through the Provider

```typescript
export class ConceptGatewayProvider {
  async get(): Promise<ConceptGateway> {
    return new ConceptService(
      new DefaultStore(
        () => ({}),
        (values) => values,
      ),
      new DefaultStore(
        () => ({}),
        (values) => values,
      ),
    );
  }
}
```

### Store Dependency Interface

- Declared in `dependencies.ts` as empty interface extending generic `Store`
  ```typescript
  export interface TermStore extends Store<Term> {}
  ```

### Info (Read Model)

- Located in `models/info/`
- Read-only projections from events, not write-side entities

### Procedure (Domain Service)

- Located in `models/procedures/`
- Cross-entity domain logic, stateless, dependencies injected

## React Components

- **`function` declaration** (not `const` arrow), no `React.FC`
- **Props destructured in function body** (first line), not in parameter position
  ```typescript
  export function StickyNoteNode(props: NodeProps<StickyNoteFlowNode>) {
    const { data, selected, id } = props;
  ```
- **forwardRef**: named function (not arrow)
  ```typescript
  export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(
    function ContentEditable(props, ref) { ... }
  );
  ```
- **`'use client'`** at file top for client-side interactive components
- **Type definitions above component**: Data type → FlowNode type → component function
  ```typescript
  export type StickyNoteNodeData = { type: StickyNoteType; text: string; };
  export type StickyNoteFlowNode = Node<StickyNoteNodeData> & { type: 'stickyNote' };
  export function StickyNoteNode(props: NodeProps<StickyNoteFlowNode>) { ... }
  ```

## Hooks

- **Filename**: `use-<name>.ts` (kebab-case)
- **Export**: named `function` declaration
- **Parameters**: options object for multiple params; direct for single param
- **Return type**: `void` for side-effect hooks; object `{ takeSnapshot, undo, redo }` for data hooks
- **useEffect cleanup**: always remove event listeners
- **useCallback**: for performance-sensitive handlers; arrow function for general handlers

## Event Handler Naming

- **Internal handlers**: `handle<Action>` — `handleContentChange`, `handleClick`, `handleBlur`
- **Callback props**: `on<Event>` — `onContentChange`, `onEditStart`, `onEditEnd`
- **Simple inline**: direct arrow function — `onEditStart={() => setIsEditing(true)}`

## Styling

- **Tailwind CSS only**, no CSS modules or styled-components
- **`cn()` utility** from `@/lib/utils` to merge class names
- **Multi-line className**: one semantic group per line
  ```typescript
  className={cn(
    'w-full h-full shadow rounded-md text-center',
    'p-3 flex flex-col items-center justify-center',
    isEditing && 'nowheel nodrag',
  )}
  ```
- **Config mapping**: `Record<EnumType, string>` for enum-to-className
  ```typescript
  export const StickyNoteBgClassName: Record<StickyNoteType, string> = {
    [StickyNoteType.EventTerm]: 'bg-orange-300',
  };
  ```

## Testing

- **Test location**:
  - Service tests: `tests/` folder — `tests/<module-name>/<service-name>.test.ts`
  - Model tests: co-located — `models/records/<model-name>.test.ts`
- **Structure**: `describe` / `it` with nesting
  ```typescript
  describe('Term', () => {
    describe('added', () => {
      it('should return new Term with TermAdded event appended', () => { ... });
    });
  });
  ```
- **describe**: class/function name being tested
- **it**: `should <expected behavior>` format
- **Arrange-Act-Assert**: clearly separated in three sections
- **One behavior per test**: each `it` verifies one thing

## Other Conventions

- **`??`** for defaults (not `||`)
- **`?.`** for optional callbacks — `props.onEditStart?.()`
- **Type guard in filter**: `filter((value): value is TItem => value !== null)`
- **Template literal types** for message type format — `` `${string}:${string}` ``
- **No JSDoc/TSDoc**: code is self-documenting
- **Helper functions**: at file top before exports, `function` declaration
  ```typescript
  function escapeHtml(text: string): string { ... }

  export function StickyNoteNode(...) { ... }
  ```
- **`crypto.randomUUID()`** for ID generation
