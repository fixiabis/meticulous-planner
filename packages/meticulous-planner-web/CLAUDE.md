# Meticulous Planner Web — Project Guide

## 專案目的

DDD 領域建模工具，讓不懂 DDD 術語的業務人員也能自然使用。
核心流程：**自然語言描述（中文）→ 結構化 Model → 實作程式碼（多語言）**

---

## 領域層級

```
Project   → 包含多個 Systems
  System  → 包含多個 Services（DDD subdomain，用戶只知道「系統」）
    Service → 包含多個 Models（= repo / monorepo package，用戶只知道「服務」）
      Model → 領域物件（Entity、AggregateRoot、ValueObject 等）
```

---

## 路由結構（已實作）

```
/                                                                → Project 選擇器
/projects/[projectId]                                            → 系統列表
/systems/[systemId]                                              → System 主頁（含 Sidebar）
/systems/[systemId]/services/[serviceId]                         → Service 頁面（Models as blocks）
/systems/[systemId]/models/[modelId]                             → Model 頁面（分割面板）
/systems/[systemId]/services/[serviceId]/models/[modelId]        → redirect → 上方路由
```

---

## Tech Stack

- **Next.js** (App Router) + TypeScript + Tailwind + shadcn/ui
- **State**: Zustand store（`hooks/modeling/modeling-service.ts`），含 localStorage persist
- **Queries**: TanStack Query（`hooks/modeling/queries.ts`）
- **AI 翻譯**: Gemini `gemini-2.0-flash`（`NEXT_PUBLIC_GEMINI_API_KEY`）

---

## 語言系統（三語）

每個 Model 元素（名稱、attribute、operation 等）都有三種語言描述：

| Language | 定位 | 可編輯 | 說明 |
|---|---|---|---|
| `Chinese` | 業務中文 | ✅ | 用戶主要輸入語言 |
| `English` | 自然商業英文 | ✅ | 空格分詞，e.g. "order number" |
| `Technical` | lower-kebab-case | ❌ 唯讀 | 自動從 English 派生，e.g. "order-number" |

**English → Technical 自動派生規則**（`lib/naming.ts`）：
- 空格 → `-`，全部小寫，去除非 `a-z0-9-` 字元
- 在 English view 輸入時，同步 dispatch Technical

**Codegen identifier fallback 順序**（各語言 codegen 共同規則）：
- Technical name → English name（`toTechnicalName()`）→ fallback string
- 絕不 fallback 到中文（中文不是合法 TypeScript identifier）

---

## Model 頁面佈局

`app/systems/[systemId]/models/[modelId]/page.tsx`

- 左側：`ModelEditor`（語言切換器 + 對應 view）
- 右側：`CodeViewer`（即時 TypeScript codegen + AI 翻譯按鈕）
- 使用 `ResizablePanelGroup` 可拖動分割

---

## 關鍵檔案地圖

### 領域模型（`models/modeling/`）
| 檔案 | 職責 |
|---|---|
| `values.ts` | 所有 enum 和 branded ID types |
| `project.ts` / `system.ts` / `service.ts` / `model.ts` | 領域物件 class |
| `base.ts` | 內建 base models（string、number、boolean 等），含中英文描述 |
| `messages/commands.ts` | 所有 Command types |
| `messages/queries.ts` | 所有 Query types |
| `codegen/typescript.ts` | TypeScript 程式碼生成純函數（架構支援多語言，可在此目錄擴充） |

### Hooks（`hooks/modeling/`）
| 檔案 | 職責 |
|---|---|
| `modeling-service.ts` | Zustand store，含 localStorage persist 和 class revival |
| `queries.ts` | TanStack Query hooks（useModel、useSystemModels 等） |
| `use-model-commands.ts` | 彙整所有 Model command hooks，export `ModelCommands` type |
| `translation.ts` | Gemini AI 翻譯（Chinese → English + auto Technical） |
| `project-commands.ts` / `system-commands.ts` / `service-commands.ts` | 各層 command hooks |
| `model-*-commands.ts` | Model 各子元素 command hooks |

### Components（`components/modeling/`）
| 檔案 | 職責 |
|---|---|
| `blocks/model-editor.tsx` | 語言切換器，mount 對應 view |
| `views/model-chinese-view.tsx` | 中文編輯 view |
| `views/model-english-view.tsx` | 英文編輯 view（含 auto-Technical dispatch） |
| `views/model-technical-view.tsx` | Technical 唯讀 view |
| `elements/code-viewer.tsx` | 程式碼顯示 + 翻譯按鈕 |
| `elements/stereotype-select.tsx` | Stereotype 選擇（三語 labels） |
| `elements/multiplicity-select.tsx` | Multiplicity 選擇（三語 labels） |
| `elements/system-type-select.tsx` | SystemType 選擇（三語 labels） |
| `elements/service-type-select.tsx` | ServiceType 選擇（三語 labels） |
| `sections/system-sidebar.tsx` | 左側 sidebar（Service + Model 列表） |
| `blocks/service-editor.tsx` | Service 頁面的 Model 區塊列表 |

### Utilities（`lib/`）
| 檔案 | 職責 |
|---|---|
| `naming.ts` | `toTechnicalName()`, `kebabToPascalCase()`, `kebabToCamelCase()` |

---

## UI 語言設計原則

**中文 view**：貼近業務用語，避免 DDD 術語
- AggregateRoot → 記錄、Entity → 記錄項目、ValueObject → 格式

**英文 view**：自然商業英文，**不是**技術文件英文
- 用 "actions"（不用 "operations"）、"fields"（不用 "attributes"）
- 用 "inputs"（不用 "parameters"）、"giving back"（不用 "returns"）
- 用 "for a specific purpose / for any purpose"（不用 "single-purpose / parameterized"）

**Technical view**：唯讀，給開發者看的 kebab-case identifier

**Select labels** 遵循同樣原則，三語各一套，以 `LABELS[language]` map 管理。
- AggregateRoot 英文 → "Record"（不用 "Aggregate Root"）
- Multiplicity Multiple 英文 → "any number of"（不用 "multiple"）

---

## State 持久化

Zustand + localStorage（`persist` middleware）。
所有 class 實例（Project、System、Service、Model 等）在從 JSON 恢復時需走 `revive*()` 函數（在 `modeling-service.ts`），否則 class methods 會不存在。

---

## Codegen 規則

架構支援多語言（目前實作：TypeScript）。
新增語言只需在 `models/modeling/codegen/` 新增對應的純函數檔案。

### TypeScript（`models/modeling/codegen/typescript.ts`）

| Stereotype | 輸出 |
|---|---|
| AggregateRoot | `export class Foo { private constructor(...) {} static create(...) {} }` |
| Entity | `export class Foo { constructor(...) {} }` |
| ValueObject | `export class Foo { constructor(readonly ...) {} }` |
| Command / Event / Query / ReadModel / Actor | `export type Foo = { ... }` |
| Error | `export class FooError extends Error { ... }` |
| ExternalSystem | `export interface Foo { ... }` |
| DomainService | `export interface FooService { ... }` |
| Enumeration | `export enum Foo { Item = 'code' }` |

- 型別名稱用 `kebabToPascalCase`（`order-item` → `OrderItem`）
- 成員名稱用 `kebabToCamelCase`（`order-id` → `orderId`）
