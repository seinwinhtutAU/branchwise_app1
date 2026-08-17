import * as fx from "@/data/fixtures";
import type {
  Customer,
  Delivery,
  DeliveryItem,
  ExchangeRate,
  Factory,
  Order,
  OrderItem,
  Package,
  Product,
  ProductVariant,
  Purchase,
  Receiving,
  Shipment,
  Warehouse,
} from "@/data/types";

// ---- simple lookups -------------------------------------------------------

export function getCustomer(customerId: string): Customer | undefined {
  return fx.customers.find((c) => c.customerId === customerId);
}

export function getProduct(productId: string): Product | undefined {
  return fx.products.find((p) => p.productId === productId);
}

export function getVariant(variantId: string): ProductVariant | undefined {
  return fx.productVariants.find((v) => v.variantId === variantId);
}

export function getVariantsForProduct(productId: string): ProductVariant[] {
  return fx.productVariants.filter((v) => v.productId === productId);
}

// Resolves a variant straight to its parent product — most consumers only
// need the style's name/code and don't care about the variant in between.
export function getProductForVariant(variantId: string): Product | undefined {
  const variant = getVariant(variantId);
  return variant ? getProduct(variant.productId) : undefined;
}

export function getFactory(factoryId: string): Factory | undefined {
  return fx.factories.find((f) => f.factoryId === factoryId);
}

export function getWarehouse(warehouseId: string): Warehouse | undefined {
  return fx.warehouses.find((w) => w.warehouseId === warehouseId);
}

export function getExchangeRate(currencyCode: string): ExchangeRate | undefined {
  return fx.exchangeRates.find((r) => r.currencyCode === currencyCode);
}

// Converts an amount in currencyCode into MMK (the base reporting currency)
// using the current global rate. Returns null if the currency is unknown.
export function convertToBase(amount: number, currencyCode: string): number | null {
  const rate = getExchangeRate(currencyCode);
  return rate ? amount * rate.rateToBase : null;
}

export function getOrder(orderId: string): Order | undefined {
  return fx.orders.find((o) => o.orderId === orderId);
}

export function getPurchase(purchaseId: string): Purchase | undefined {
  return fx.purchases.find((p) => p.purchaseId === purchaseId);
}

export function getPackage(packageId: string): Package | undefined {
  return fx.packages.find((p) => p.packageId === packageId);
}

export function getShipment(shipmentId: string): Shipment | undefined {
  return fx.shipments.find((s) => s.shipmentId === shipmentId);
}

export function getReceiving(receivingId: string): Receiving | undefined {
  return fx.receivings.find((r) => r.receivingId === receivingId);
}

// ---- packages: resolved via purchase_allocations, not a direct FK ---------
//
// A package_item points at a purchase_allocation (a specific purchase-item
// -> order-item link), not a raw product+purchase. So "which purchases does
// this package touch" and "which packages hold this purchase's stock" both
// have to be derived by walking that join, rather than reading a column.

export interface PackageItemDetail {
  packageItemId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  purchase: Purchase;
  order: Order;
  customer: Customer;
}

export function getPackageItemDetails(packageId: string): PackageItemDetail[] {
  return fx.packageItems
    .filter((pki) => pki.packageId === packageId)
    .map((pki) => {
      const allocation = fx.purchaseAllocations.find((a) => a.allocationId === pki.purchaseAllocationId)!;
      const purchaseItem = fx.purchaseItems.find((pi) => pi.purchaseItemId === allocation.purchaseItemId)!;
      const orderItem = fx.orderItems.find((oi) => oi.orderItemId === allocation.orderItemId)!;
      const order = getOrder(orderItem.orderId)!;
      const variant = getVariant(purchaseItem.variantId)!;

      return {
        packageItemId: pki.packageItemId,
        product: getProduct(variant.productId)!,
        variant,
        quantity: pki.quantity,
        purchase: getPurchase(purchaseItem.purchaseId)!,
        order,
        customer: getCustomer(order.customerId)!,
      };
    });
}

export function getPackagesForPurchase(purchaseId: string): Package[] {
  const purchaseItemIds = new Set(
    fx.purchaseItems.filter((pi) => pi.purchaseId === purchaseId).map((pi) => pi.purchaseItemId),
  );
  const allocationIds = new Set(
    fx.purchaseAllocations.filter((a) => purchaseItemIds.has(a.purchaseItemId)).map((a) => a.allocationId),
  );
  const packageIds = new Set(
    fx.packageItems.filter((pki) => allocationIds.has(pki.purchaseAllocationId)).map((pki) => pki.packageId),
  );
  return fx.packages.filter((p) => packageIds.has(p.packageId));
}

// ---- customer-centric views -------------------------------------------------
//
// Answers "which X is for this customer" without needing any document
// numbers: everything is derived by walking orders -> order_items ->
// purchase_allocations -> purchase_items/package_items, the same join used
// elsewhere, just entered from the customer side.

export function getCustomerOrders(customerId: string): Order[] {
  return fx.orders.filter((o) => o.customerId === customerId);
}

function getCustomerOrderItemIds(customerId: string): Set<string> {
  const orderIds = new Set(getCustomerOrders(customerId).map((o) => o.orderId));
  return new Set(fx.orderItems.filter((i) => orderIds.has(i.orderId)).map((i) => i.orderItemId));
}

export interface CustomerProductSummary {
  product: Product;
  totalOrdered: number;
  orderCount: number;
}

export function getCustomerProducts(customerId: string): CustomerProductSummary[] {
  const orderIds = new Set(getCustomerOrders(customerId).map((o) => o.orderId));
  const items = fx.orderItems.filter((i) => orderIds.has(i.orderId));

  const byProduct = new Map<string, { totalOrdered: number; orderIds: Set<string> }>();
  for (const item of items) {
    const productId = getProductForVariant(item.variantId)!.productId;
    const entry = byProduct.get(productId) ?? { totalOrdered: 0, orderIds: new Set<string>() };
    entry.totalOrdered += item.quantity;
    entry.orderIds.add(item.orderId);
    byProduct.set(productId, entry);
  }

  return Array.from(byProduct.entries()).map(([productId, entry]) => ({
    product: getProduct(productId)!,
    totalOrdered: entry.totalOrdered,
    orderCount: entry.orderIds.size,
  }));
}

export function getCustomerPurchases(customerId: string): Purchase[] {
  const orderItemIds = getCustomerOrderItemIds(customerId);
  const purchaseItemIds = new Set(
    fx.purchaseAllocations.filter((a) => orderItemIds.has(a.orderItemId)).map((a) => a.purchaseItemId),
  );
  const purchaseIds = new Set(
    fx.purchaseItems.filter((pi) => purchaseItemIds.has(pi.purchaseItemId)).map((pi) => pi.purchaseId),
  );
  return fx.purchases.filter((p) => purchaseIds.has(p.purchaseId));
}

export function getCustomerPackages(customerId: string): Package[] {
  const orderItemIds = getCustomerOrderItemIds(customerId);
  const allocationIds = new Set(
    fx.purchaseAllocations.filter((a) => orderItemIds.has(a.orderItemId)).map((a) => a.allocationId),
  );
  const packageIds = new Set(
    fx.packageItems.filter((pki) => allocationIds.has(pki.purchaseAllocationId)).map((pki) => pki.packageId),
  );
  return fx.packages.filter((p) => packageIds.has(p.packageId));
}

export function getCustomerDeliveries(customerId: string): Delivery[] {
  const orderIds = new Set(getCustomerOrders(customerId).map((o) => o.orderId));
  return fx.deliveries.filter((d) => orderIds.has(d.orderId));
}

// A delivery line either came from warehouse stock (via StockAllocation) or
// shipped straight from a purchase to the customer, bypassing the warehouse
// entirely (via PurchaseAllocation) — see DeliveryItem.
export interface DeliveryItemSource {
  kind: "warehouse" | "direct" | "unknown";
  warehouse?: Warehouse;
  factory?: Factory;
}

export function getDeliveryItemSource(item: DeliveryItem): DeliveryItemSource {
  if (item.stockAllocationId) {
    const allocation = fx.stockAllocations.find((a) => a.allocationId === item.stockAllocationId);
    const inv = allocation && fx.inventory.find((i) => i.inventoryId === allocation.inventoryId);
    return { kind: "warehouse", warehouse: inv ? getWarehouse(inv.warehouseId) : undefined };
  }
  if (item.purchaseAllocationId) {
    const allocation = fx.purchaseAllocations.find((a) => a.allocationId === item.purchaseAllocationId);
    const purchaseItem =
      allocation && fx.purchaseItems.find((pi) => pi.purchaseItemId === allocation.purchaseItemId);
    const purchase = purchaseItem && getPurchase(purchaseItem.purchaseId);
    return { kind: "direct", factory: purchase ? getFactory(purchase.factoryId) : undefined };
  }
  return { kind: "unknown" };
}

// ---- product-centric views ---------------------------------------------------
//
// Answers "which factory supplies this" / "which orders include this" /
// "where is this product right now" without needing document numbers.

export interface ProductFactorySummary {
  factory: Factory;
  totalPurchased: number;
}

export function getProductFactories(productId: string): ProductFactorySummary[] {
  const variantIds = new Set(getVariantsForProduct(productId).map((v) => v.variantId));
  const items = fx.purchaseItems.filter((pi) => variantIds.has(pi.variantId));
  const byFactory = new Map<string, number>();
  for (const item of items) {
    const purchase = getPurchase(item.purchaseId)!;
    byFactory.set(purchase.factoryId, (byFactory.get(purchase.factoryId) ?? 0) + item.quantity);
  }
  return Array.from(byFactory.entries()).map(([factoryId, totalPurchased]) => ({
    factory: getFactory(factoryId)!,
    totalPurchased,
  }));
}

export interface ProductOrderSummary {
  order: Order;
  customer: Customer;
  quantity: number;
}

export function getProductOrders(productId: string): ProductOrderSummary[] {
  const variantIds = new Set(getVariantsForProduct(productId).map((v) => v.variantId));
  return fx.orderItems
    .filter((i) => variantIds.has(i.variantId))
    .map((item) => {
      const order = getOrder(item.orderId)!;
      return { order, customer: getCustomer(order.customerId)!, quantity: item.quantity };
    });
}

/** Shipments currently carrying this product that haven't arrived yet — "where is it right now". */
export function getProductShipmentsInTransit(productId: string): Shipment[] {
  const variantIds = new Set(getVariantsForProduct(productId).map((v) => v.variantId));
  const purchaseItemIds = new Set(
    fx.purchaseItems.filter((pi) => variantIds.has(pi.variantId)).map((pi) => pi.purchaseItemId),
  );
  const allocationIds = new Set(
    fx.purchaseAllocations.filter((a) => purchaseItemIds.has(a.purchaseItemId)).map((a) => a.allocationId),
  );
  const packageIds = new Set(
    fx.packageItems.filter((pki) => allocationIds.has(pki.purchaseAllocationId)).map((pki) => pki.packageId),
  );
  const shipmentIds = new Set(
    fx.shipmentPackages.filter((sp) => packageIds.has(sp.packageId)).map((sp) => sp.shipmentId),
  );
  return fx.shipments.filter((s) => shipmentIds.has(s.shipmentId) && s.status !== "arrived");
}

// ---- order items with cross-entity fulfillment rollups --------------------

export interface OrderItemFulfillment {
  item: OrderItem;
  product: Product;
  variant: ProductVariant;
  ordered: number;
  purchased: number;
  delivered: number;
}

export function getOrderItemsWithFulfillment(orderId: string): OrderItemFulfillment[] {
  const items = fx.orderItems.filter((i) => i.orderId === orderId);
  const orderDeliveryIds = fx.deliveries
    .filter((d) => d.orderId === orderId && d.status === "delivered")
    .map((d) => d.deliveryId);

  return items.map((item) => {
    const variant = getVariant(item.variantId)!;
    const product = getProduct(variant.productId)!;

    const purchased = fx.purchaseAllocations
      .filter((a) => a.orderItemId === item.orderItemId)
      .reduce((sum, a) => sum + a.quantity, 0);

    const delivered = fx.deliveryItems
      .filter((di) => orderDeliveryIds.includes(di.deliveryId) && di.variantId === item.variantId)
      .reduce((sum, di) => sum + di.quantity, 0);

    return { item, product, variant, ordered: item.quantity, purchased, delivered };
  });
}

export function getOrderTotals(orderId: string) {
  const rows = getOrderItemsWithFulfillment(orderId);
  return rows.reduce(
    (acc, r) => ({
      ordered: acc.ordered + r.ordered,
      purchased: acc.purchased + Math.min(r.purchased, r.ordered),
      delivered: acc.delivered + r.delivered,
    }),
    { ordered: 0, purchased: 0, delivered: 0 },
  );
}

// ---- cross-links: which orders does a purchase item serve, and vice versa --
//
// A single purchase item can be split across many orders (one factory run
// covering several customers' orders), and a single order item can be
// sourced from many purchases (one order's products bought from different
// factories). purchase_allocations is the join table for both directions.

export interface OrderAllocationBreakdown {
  orderId: string;
  orderNo: string;
  customerName: string;
  quantity: number;
}

export function getPurchaseItemOrderBreakdown(purchaseItemId: string): OrderAllocationBreakdown[] {
  return fx.purchaseAllocations
    .filter((a) => a.purchaseItemId === purchaseItemId)
    .map((a) => {
      const orderItem = fx.orderItems.find((oi) => oi.orderItemId === a.orderItemId)!;
      const order = getOrder(orderItem.orderId)!;
      const customer = getCustomer(order.customerId)!;
      return { orderId: order.orderId, orderNo: order.orderNo, customerName: customer.name, quantity: a.quantity };
    });
}

export interface PurchaseAllocationBreakdown {
  purchaseId: string;
  purchaseNo: string;
  factoryName: string;
  quantity: number;
}

export function getOrderItemPurchaseBreakdown(orderItemId: string): PurchaseAllocationBreakdown[] {
  return fx.purchaseAllocations
    .filter((a) => a.orderItemId === orderItemId)
    .map((a) => {
      const purchaseItem = fx.purchaseItems.find((pi) => pi.purchaseItemId === a.purchaseItemId)!;
      const purchase = getPurchase(purchaseItem.purchaseId)!;
      const factory = getFactory(purchase.factoryId)!;
      return {
        purchaseId: purchase.purchaseId,
        purchaseNo: purchase.purchaseNo,
        factoryName: factory.name,
        quantity: a.quantity,
      };
    });
}

// ---- order fulfillment chain (Purchase -> Package -> Shipment -> Receiving) --

export interface PurchaseChain {
  purchase: Purchase;
  packages: Package[];
  shipments: Shipment[];
  receivings: Receiving[];
}

export function getOrderFulfillmentChains(orderId: string): {
  purchaseChains: PurchaseChain[];
  deliveries: Delivery[];
} {
  const itemIds = fx.orderItems.filter((i) => i.orderId === orderId).map((i) => i.orderItemId);

  const purchaseItemIds = new Set(
    fx.purchaseAllocations.filter((a) => itemIds.includes(a.orderItemId)).map((a) => a.purchaseItemId),
  );
  const purchaseIds = new Set(
    fx.purchaseItems.filter((pi) => purchaseItemIds.has(pi.purchaseItemId)).map((pi) => pi.purchaseId),
  );

  const purchaseChains: PurchaseChain[] = Array.from(purchaseIds).map((purchaseId) => {
    const purchase = getPurchase(purchaseId)!;
    const packages = getPackagesForPurchase(purchaseId);
    const packageIds = packages.map((p) => p.packageId);
    const shipmentIds = fx.shipmentPackages
      .filter((sp) => packageIds.includes(sp.packageId))
      .map((sp) => sp.shipmentId);
    const shipments = fx.shipments.filter((s) => shipmentIds.includes(s.shipmentId));
    const receivings = fx.receivings.filter((r) => shipmentIds.includes(r.shipmentId));

    return { purchase, packages, shipments, receivings };
  });

  const deliveries = fx.deliveries.filter((d) => d.orderId === orderId);

  return { purchaseChains, deliveries };
}

// ---- "what needs my attention" -------------------------------------------

export type AttentionSeverity = "info" | "warning" | "danger";

export interface OrderAttention {
  reason: string;
  severity: AttentionSeverity;
}

export function getOrderAttention(order: Order): OrderAttention | null {
  if (order.status === "cancelled" || order.status === "fulfilled" || order.status === "draft") {
    return null;
  }

  const { purchaseChains, deliveries } = getOrderFulfillmentChains(order.orderId);
  const totals = getOrderTotals(order.orderId);

  if (purchaseChains.length === 0) {
    return { reason: "Waiting for purchase", severity: "warning" };
  }

  const hasDelayedShipment = purchaseChains.some((c) => c.shipments.some((s) => s.status === "delayed"));
  if (hasDelayedShipment) {
    return { reason: "Shipment delayed", severity: "danger" };
  }

  const allReceived = purchaseChains.every(
    (c) => c.shipments.length > 0 && c.shipments.every((s) => s.status === "arrived"),
  );
  if (allReceived && deliveries.length === 0 && totals.purchased >= totals.ordered) {
    return { reason: "Ready for delivery", severity: "info" };
  }

  if (totals.delivered > 0 && totals.delivered < totals.ordered) {
    return { reason: "Partially fulfilled", severity: "warning" };
  }

  if (totals.purchased < totals.ordered) {
    return { reason: "Purchase in progress", severity: "info" };
  }

  return null;
}

export function getOrdersRequiringAttention(): Array<{ order: Order; attention: OrderAttention }> {
  return fx.orders
    .map((order) => ({ order, attention: getOrderAttention(order) }))
    .filter((r): r is { order: Order; attention: OrderAttention } => r.attention !== null);
}

// ---- shipments -------------------------------------------------------------

export function getShipmentPackages(shipmentId: string): Package[] {
  const packageIds = fx.shipmentPackages
    .filter((sp) => sp.shipmentId === shipmentId)
    .map((sp) => sp.packageId);
  return fx.packages.filter((p) => packageIds.includes(p.packageId));
}

export function getShipmentLegs(shipmentId: string) {
  return fx.transportationLegs
    .filter((l) => l.shipmentId === shipmentId)
    .sort((a, b) => (a.departureDate ?? "").localeCompare(b.departureDate ?? ""));
}

export function isShipmentNeedsReceiving(shipment: Shipment): boolean {
  if (shipment.status !== "arrived") return true;
  return !fx.receivings.some((r) => r.shipmentId === shipment.shipmentId && r.status === "completed");
}

// ---- inventory ---------------------------------------------------------------

export interface InventoryRow {
  inventoryId: string;
  product: Product;
  variant: ProductVariant;
  warehouse: Warehouse;
  quantity: number;
  reserved: number;
  incoming: number;
  available: number;
  expectedAvailable: number;
  lowStock: boolean;
}

const LOW_STOCK_THRESHOLD = 10;

export function getInventoryRows(): InventoryRow[] {
  return fx.inventory.map((row) => {
    const available = row.quantity - row.reservedQuantity;
    const variant = getVariant(row.variantId)!;
    return {
      inventoryId: row.inventoryId,
      product: getProduct(variant.productId)!,
      variant,
      warehouse: getWarehouse(row.warehouseId)!,
      quantity: row.quantity,
      reserved: row.reservedQuantity,
      incoming: row.incomingQuantity,
      available,
      expectedAvailable: available + row.incomingQuantity,
      lowStock: available <= LOW_STOCK_THRESHOLD,
    };
  });
}

// ---- dashboard stats ---------------------------------------------------------

// ---- order progress stepper -------------------------------------------------

export type StepState = "complete" | "current" | "upcoming";

export interface OrderProgressStep {
  label: string;
  state: StepState;
}

export function getOrderProgressSteps(orderId: string): OrderProgressStep[] {
  const order = getOrder(orderId)!;
  const totals = getOrderTotals(orderId);
  const { purchaseChains } = getOrderFulfillmentChains(orderId);

  const orderedState: StepState = order.status === "draft" ? "current" : "complete";

  const purchasedState: StepState =
    totals.purchased >= totals.ordered && totals.ordered > 0
      ? "complete"
      : totals.purchased > 0
        ? "current"
        : "upcoming";

  const allPackages = purchaseChains.flatMap((c) => c.packages);
  const packedState: StepState =
    allPackages.length === 0
      ? "upcoming"
      : allPackages.every((p) => p.status !== "preparing")
        ? "complete"
        : "current";

  const allShipments = purchaseChains.flatMap((c) => c.shipments);
  const shippedState: StepState = allShipments.length === 0 ? "upcoming" : "complete";

  const receivedState: StepState =
    allShipments.length === 0
      ? "upcoming"
      : allShipments.every((s) => s.status === "arrived")
        ? "complete"
        : "current";

  const deliveredState: StepState =
    totals.delivered >= totals.ordered && totals.ordered > 0
      ? "complete"
      : totals.delivered > 0
        ? "current"
        : "upcoming";

  return [
    { label: "Ordered", state: orderedState },
    { label: "Purchased", state: purchasedState },
    { label: "Packed", state: packedState },
    { label: "Shipped", state: shippedState },
    { label: "Received", state: receivedState },
    { label: "Delivered", state: deliveredState },
  ];
}

export function getDashboardStats() {
  const openOrders = fx.orders.filter((o) =>
    ["pending", "processing", "partially_fulfilled"].includes(o.status),
  ).length;

  const toPurchase = getOrdersRequiringAttention().filter(
    (r) => r.attention.reason === "Waiting for purchase",
  ).length;

  const inTransit = fx.shipments.filter((s) => s.status === "in_transit").length;

  const toReceive = fx.shipments.filter((s) => isShipmentNeedsReceiving(s)).length;

  return { openOrders, toPurchase, inTransit, toReceive };
}
