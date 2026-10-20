import { Attribute } from './attribute';
import { Description } from './description';
import { EnumerationItem } from './enumeration-item';
import { Model } from './model';
import { Operation } from './operation';
import { Parameter } from './parameter';
import { Project } from './project';
import { Service } from './service';
import { System } from './system';
import { TypeReference } from './type-reference';
import {
  AttributeId,
  EnumerationItemId,
  Language,
  ModelId,
  Multiplicity,
  OperationId,
  OperationStereotype,
  ParameterId,
  ProjectId,
  ServiceId,
  Stereotype,
  SystemId,
  SystemType,
  ServiceType,
} from './values';

// ── 範例資料 ─────────────────────────────────────────────────────────────────────
// 一份「電商平台 / 訂單系統」的完整示範領域模型，用於演示三語切換與 codegen。
// 所有 id 以 `example-` 為前綴，載入時會覆蓋舊的範例資料（見 loadExample）。

export const EXAMPLE_ID_PREFIX = 'example-';

const PROJECT_ID = ProjectId('example-ecommerce');
const SYSTEM_ID = SystemId('example-order-system');
const SERVICE_ID = ServiceId('example-order-service');

const ORDER_ID = ModelId('example-order');
const ORDER_ITEM_ID = ModelId('example-order-item');
const ORDER_STATUS_ID = ModelId('example-order-status');
const MONEY_ID = ModelId('example-money');

// base models（由 buildBaseModels 在查詢時注入，此處僅引用其 id）
const BASE_STRING = ModelId('base-string');
const BASE_INTEGER = ModelId('base-integer');
const BASE_DECIMAL = ModelId('base-decimal');
const BASE_DATETIME = ModelId('base-datetime');

function desc(chinese: string, english: string): Record<string, Description> {
  return {
    [Language.Chinese]: Description.create({ name: chinese, language: Language.Chinese }),
    [Language.English]: Description.create({ name: english, language: Language.English }),
  };
}

function modelRef(modelId: ModelId): TypeReference {
  return TypeReference.createModel(modelId);
}

export type ExampleData = {
  projects: Project[];
  systems: System[];
  services: Service[];
  models: Model[];
};

export function buildExampleData(): ExampleData {
  const project = Project.create({ id: PROJECT_ID, descriptions: desc('電商平台', 'e-commerce platform') });

  const system = System.create({
    id: SYSTEM_ID,
    projectId: PROJECT_ID,
    systemType: SystemType.Core,
    descriptions: desc('訂單系統', 'order system'),
  });

  const service = Service.create({
    id: SERVICE_ID,
    projectId: PROJECT_ID,
    systemId: SYSTEM_ID,
    serviceType: ServiceType.Core,
    descriptions: desc('訂單服務', 'order service'),
  });

  // 金額（ValueObject）
  const money = Model.create({
    id: MONEY_ID,
    projectId: PROJECT_ID,
    systemId: SYSTEM_ID,
    serviceId: SERVICE_ID,
    stereotype: Stereotype.ValueObject,
    descriptions: desc('金額', 'money'),
    attributes: [
      Attribute.create({
        id: AttributeId('example-money-currency'),
        type: modelRef(BASE_STRING),
        descriptions: desc('幣別', 'currency'),
      }),
      Attribute.create({
        id: AttributeId('example-money-amount'),
        type: modelRef(BASE_DECIMAL),
        descriptions: desc('數值', 'amount'),
      }),
    ],
  });

  // 訂單狀態（Enumeration）
  const orderStatus = Model.create({
    id: ORDER_STATUS_ID,
    projectId: PROJECT_ID,
    systemId: SYSTEM_ID,
    serviceId: SERVICE_ID,
    stereotype: Stereotype.Enumeration,
    descriptions: desc('訂單狀態', 'order status'),
    enumerationItems: [
      EnumerationItem.create({ id: EnumerationItemId('example-status-pending'), code: 'pending', descriptions: desc('待付款', 'pending payment') }),
      EnumerationItem.create({ id: EnumerationItemId('example-status-paid'), code: 'paid', descriptions: desc('已付款', 'paid') }),
      EnumerationItem.create({ id: EnumerationItemId('example-status-shipped'), code: 'shipped', descriptions: desc('已出貨', 'shipped') }),
      EnumerationItem.create({ id: EnumerationItemId('example-status-completed'), code: 'completed', descriptions: desc('已完成', 'completed') }),
      EnumerationItem.create({ id: EnumerationItemId('example-status-cancelled'), code: 'cancelled', descriptions: desc('已取消', 'cancelled') }),
    ],
  });

  // 訂單項目（Entity）
  const orderItem = Model.create({
    id: ORDER_ITEM_ID,
    projectId: PROJECT_ID,
    systemId: SYSTEM_ID,
    serviceId: SERVICE_ID,
    stereotype: Stereotype.Entity,
    descriptions: desc('訂單項目', 'order item'),
    attributes: [
      Attribute.create({
        id: AttributeId('example-item-product-name'),
        type: modelRef(BASE_STRING),
        descriptions: desc('商品名稱', 'product name'),
      }),
      Attribute.create({
        id: AttributeId('example-item-unit-price'),
        type: modelRef(MONEY_ID),
        descriptions: desc('單價', 'unit price'),
      }),
      Attribute.create({
        id: AttributeId('example-item-quantity'),
        type: modelRef(BASE_INTEGER),
        descriptions: desc('數量', 'quantity'),
      }),
    ],
  });

  // 訂單（AggregateRoot）
  const order = Model.create({
    id: ORDER_ID,
    projectId: PROJECT_ID,
    systemId: SYSTEM_ID,
    serviceId: SERVICE_ID,
    stereotype: Stereotype.AggregateRoot,
    descriptions: desc('訂單', 'order'),
    attributes: [
      Attribute.create({
        id: AttributeId('example-order-number'),
        type: modelRef(BASE_STRING),
        descriptions: desc('訂單編號', 'order number'),
      }),
      Attribute.create({
        id: AttributeId('example-order-placed-at'),
        type: modelRef(BASE_DATETIME),
        descriptions: desc('下單時間', 'placed at'),
      }),
      Attribute.create({
        id: AttributeId('example-order-status'),
        type: modelRef(ORDER_STATUS_ID),
        descriptions: desc('訂單狀態', 'status'),
      }),
      Attribute.create({
        id: AttributeId('example-order-items'),
        type: modelRef(ORDER_ITEM_ID),
        multiplicity: Multiplicity.AtLeastOne,
        descriptions: desc('訂單項目', 'items'),
      }),
      Attribute.create({
        id: AttributeId('example-order-total'),
        type: modelRef(MONEY_ID),
        descriptions: desc('總金額', 'total amount'),
      }),
    ],
    operations: [
      Operation.create({
        id: OperationId('example-op-place-order'),
        stereotype: OperationStereotype.Command,
        descriptions: desc('下訂單', 'place order'),
        parameters: [
          Parameter.create({
            id: ParameterId('example-op-place-order-items'),
            type: modelRef(ORDER_ITEM_ID),
            multiplicity: Multiplicity.AtLeastOne,
            descriptions: desc('訂單項目', 'items'),
          }),
        ],
      }),
      Operation.create({
        id: OperationId('example-op-cancel-order'),
        stereotype: OperationStereotype.Command,
        descriptions: desc('取消訂單', 'cancel order'),
      }),
      Operation.create({
        id: OperationId('example-op-calculate-total'),
        stereotype: OperationStereotype.Query,
        returnType: modelRef(MONEY_ID),
        descriptions: desc('計算總金額', 'calculate total'),
      }),
    ],
  });

  return {
    projects: [project],
    systems: [system],
    services: [service],
    models: [money, orderStatus, orderItem, order],
  };
}
