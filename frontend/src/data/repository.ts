import * as fx from "@/data/fixtures";
import { type ListParams, type Page, matchesSearch, networkDelay, paginate, sortRows } from "@/data/queryHelpers";
import * as sel from "@/data/selectors";
import type {
  Customer,
  Delivery,
  DeliveryItem,
  Factory,
  Order,
  Package,
  Product,
  ProductVariant,
  Purchase,
  PurchaseItem,
  Receiving,
  ReceivingItem,
  Shipment,
  TransportationLeg,
  Warehouse,
} from "@/data/types";
import type { OrderAttention, OrderItemFulfillment, PurchaseChain } from "@/data/selectors";

// ============================================================== Orders ====

export interface OrderListRow {
  order: Order;
  customer: Customer;
  productCount: number;
  totals: { ordered: number; purchased: number; delivered: number };
  attention: OrderAttention | null;
}

export type OrderSort = "orderDate" | "orderNo" | "totalAmount" | "status";

export async function listOrders(
  params: ListParams<OrderSort> = {},
): Promise<Page<OrderListRow>> {
  await networkDelay();

  let rows: OrderListRow[] = fx.orders.map((order) => {
    const customer = sel.getCustomer(order.customerId)!;
    const items = sel.getOrderItemsWithFulfillment(order.orderId);
    const totals = sel.getOrderTotals(order.orderId);
    return {
      order,
      customer,
      productCount: items.length,
      totals,
      attention: sel.getOrderAttention(order),
    };
  });

  if (params.filters?.status) {
    rows = rows.filter((r) => r.order.status === params.filters!.status);
  }
  if (params.filters?.customerId) {
    rows = rows.filter((r) => r.order.customerId === params.filters!.customerId);
  }

  if (params.search) {
    rows = rows.filter((r) =>
      matchesSearch([r.order.orderNo, r.customer.name, r.order.source], params.search!),
    );
  }

  rows = sortRows(rows, params.sort, params.sortDir, {
    orderDate: (r) => r.order.orderDate,
    orderNo: (r) => r.order.orderNo,
    totalAmount: (r) => r.order.totalAmount,
    status: (r) => r.order.status,
  });

  return paginate(rows, params.page, params.pageSize);
}

export interface OrderDetail {
  order: Order;
  customer: Customer;
  items: OrderItemFulfillment[];
  purchaseChains: PurchaseChain[];
  deliveries: Delivery[];
  attention: OrderAttention | null;
}

export async function getOrderDetail(orderId: string): Promise<OrderDetail | undefined> {
  await networkDelay();
  const order = sel.getOrder(orderId);
  if (!order) return undefined;

  const { purchaseChains, deliveries } = sel.getOrderFulfillmentChains(orderId);

  return {
    order,
    customer: sel.getCustomer(order.customerId)!,
    items: sel.getOrderItemsWithFulfillment(orderId),
    purchaseChains,
    deliveries,
    attention: sel.getOrderAttention(order),
  };
}

// ============================================================ Purchases ===

export interface PurchaseListRow {
  purchase: Purchase;
  factory: Factory;
  productCount: number;
  totalQuantity: number;
  totalCost: number;
}

export type PurchaseSort = "purchaseDate" | "purchaseNo" | "status";

export async function listPurchases(
  params: ListParams<PurchaseSort> = {},
): Promise<Page<PurchaseListRow>> {
  await networkDelay();

  let rows: PurchaseListRow[] = fx.purchases.map((purchase) => {
    const items = fx.purchaseItems.filter((i) => i.purchaseId === purchase.purchaseId);
    return {
      purchase,
      factory: sel.getFactory(purchase.factoryId)!,
      productCount: items.length,
      totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
      totalCost: items.reduce((s, i) => s + i.quantity * i.buyingPrice, 0),
    };
  });

  if (params.filters?.status) {
    rows = rows.filter((r) => r.purchase.status === params.filters!.status);
  }
  if (params.filters?.factoryId) {
    rows = rows.filter((r) => r.purchase.factoryId === params.filters!.factoryId);
  }
  if (params.filters?.customerId) {
    const purchaseIds = new Set(sel.getCustomerPurchases(params.filters.customerId).map((p) => p.purchaseId));
    rows = rows.filter((r) => purchaseIds.has(r.purchase.purchaseId));
  }
  if (params.search) {
    rows = rows.filter((r) => matchesSearch([r.purchase.purchaseNo, r.factory.name], params.search!));
  }

  rows = sortRows(rows, params.sort, params.sortDir, {
    purchaseDate: (r) => r.purchase.purchaseDate,
    purchaseNo: (r) => r.purchase.purchaseNo,
    status: (r) => r.purchase.status,
  });

  return paginate(rows, params.page, params.pageSize);
}

export interface PurchaseDetail {
  purchase: Purchase;
  factory: Factory;
  items: Array<{ item: PurchaseItem; product: Product; variant: ProductVariant; allocated: number }>;
  relatedOrders: Order[];
  packages: Package[];
}

export async function getPurchaseDetail(purchaseId: string): Promise<PurchaseDetail | undefined> {
  await networkDelay();
  const purchase = sel.getPurchase(purchaseId);
  if (!purchase) return undefined;

  const items = fx.purchaseItems
    .filter((i) => i.purchaseId === purchaseId)
    .map((item) => {
      const variant = sel.getVariant(item.variantId)!;
      return {
        item,
        product: sel.getProduct(variant.productId)!,
        variant,
        allocated: fx.purchaseAllocations
          .filter((a) => a.purchaseItemId === item.purchaseItemId)
          .reduce((s, a) => s + a.quantity, 0),
      };
    });

  const orderItemIds = fx.purchaseAllocations
    .filter((a) => items.some((i) => i.item.purchaseItemId === a.purchaseItemId))
    .map((a) => a.orderItemId);
  const orderIds = new Set(
    fx.orderItems.filter((oi) => orderItemIds.includes(oi.orderItemId)).map((oi) => oi.orderId),
  );
  const relatedOrders = fx.orders.filter((o) => orderIds.has(o.orderId));

  const packages = sel.getPackagesForPurchase(purchaseId);

  return { purchase, factory: sel.getFactory(purchase.factoryId)!, items, relatedOrders, packages };
}

// ============================================================= Packages ===
//
// A package's items are each tied to a purchase_allocation, not a single
// purchase — so a package can (and sometimes does) span multiple purchases.
// Rows below surface that as a purchase count/list rather than one purchase.

export interface PackageListRow {
  pkg: Package;
  purchases: Purchase[];
  customers: Customer[];
  productCount: number;
  totalQuantity: number;
}

export type PackageSort = "packageNo" | "status";

export async function listPackages(
  params: ListParams<PackageSort> = {},
): Promise<Page<PackageListRow>> {
  await networkDelay();

  let rows: PackageListRow[] = fx.packages.map((pkg) => {
    const details = sel.getPackageItemDetails(pkg.packageId);
    const purchases = Array.from(new Map(details.map((d) => [d.purchase.purchaseId, d.purchase])).values());
    const customers = Array.from(new Map(details.map((d) => [d.customer.customerId, d.customer])).values());
    const productCount = new Set(details.map((d) => d.product.productId)).size;
    return {
      pkg,
      purchases,
      customers,
      productCount,
      totalQuantity: details.reduce((s, d) => s + d.quantity, 0),
    };
  });

  if (params.filters?.status) {
    rows = rows.filter((r) => r.pkg.status === params.filters!.status);
  }
  if (params.filters?.customerId) {
    rows = rows.filter((r) => r.customers.some((c) => c.customerId === params.filters!.customerId));
  }
  if (params.search) {
    rows = rows.filter((r) =>
      matchesSearch(
        [r.pkg.packageNo, ...r.purchases.map((p) => p.purchaseNo), ...r.customers.map((c) => c.name)],
        params.search!,
      ),
    );
  }

  rows = sortRows(rows, params.sort, params.sortDir, {
    packageNo: (r) => r.pkg.packageNo,
    status: (r) => r.pkg.status,
  });

  return paginate(rows, params.page, params.pageSize);
}

export interface PackageDetail {
  pkg: Package;
  purchases: Purchase[];
  items: sel.PackageItemDetail[];
  shipment: Shipment | undefined;
}

export async function getPackageDetail(packageId: string): Promise<PackageDetail | undefined> {
  await networkDelay();
  const pkg = sel.getPackage(packageId);
  if (!pkg) return undefined;

  const items = sel.getPackageItemDetails(packageId);
  const purchases = Array.from(new Map(items.map((i) => [i.purchase.purchaseId, i.purchase])).values());

  const shipmentPackage = fx.shipmentPackages.find((sp) => sp.packageId === packageId);
  const shipment = shipmentPackage ? sel.getShipment(shipmentPackage.shipmentId) : undefined;

  return { pkg, purchases, items, shipment };
}

// ============================================================ Shipments ===

export interface ShipmentListRow {
  shipment: Shipment;
  packageCount: number;
  legCount: number;
  needsReceiving: boolean;
}

export type ShipmentSort = "shipmentDate" | "shipmentNo" | "status" | "expectedArrival";

export async function listShipments(
  params: ListParams<ShipmentSort> = {},
): Promise<Page<ShipmentListRow>> {
  await networkDelay();

  let rows: ShipmentListRow[] = fx.shipments.map((shipment) => ({
    shipment,
    packageCount: sel.getShipmentPackages(shipment.shipmentId).length,
    legCount: sel.getShipmentLegs(shipment.shipmentId).length,
    needsReceiving: sel.isShipmentNeedsReceiving(shipment),
  }));

  if (params.filters?.status) {
    rows = rows.filter((r) => r.shipment.status === params.filters!.status);
  }
  if (params.search) {
    rows = rows.filter((r) =>
      matchesSearch([r.shipment.shipmentNo, r.shipment.origin, r.shipment.destination], params.search!),
    );
  }

  rows = sortRows(rows, params.sort, params.sortDir, {
    shipmentDate: (r) => r.shipment.shipmentDate,
    shipmentNo: (r) => r.shipment.shipmentNo,
    status: (r) => r.shipment.status,
    expectedArrival: (r) => r.shipment.expectedArrival ?? "",
  });

  return paginate(rows, params.page, params.pageSize);
}

export interface ShipmentDetail {
  shipment: Shipment;
  packages: Package[];
  legs: TransportationLeg[];
  receiving: Receiving | undefined;
}

export async function getShipmentDetail(shipmentId: string): Promise<ShipmentDetail | undefined> {
  await networkDelay();
  const shipment = sel.getShipment(shipmentId);
  if (!shipment) return undefined;

  return {
    shipment,
    packages: sel.getShipmentPackages(shipmentId),
    legs: sel.getShipmentLegs(shipmentId),
    receiving: fx.receivings.find((r) => r.shipmentId === shipmentId),
  };
}

// ============================================================ Receiving ===

export interface ReceivingListRow {
  receiving: Receiving;
  shipment: Shipment;
  warehouse: Warehouse;
  productCount: number;
}

export type ReceivingSort = "receivedDate" | "status";

export async function listReceivings(
  params: ListParams<ReceivingSort> = {},
): Promise<Page<ReceivingListRow>> {
  await networkDelay();

  let rows: ReceivingListRow[] = fx.receivings.map((receiving) => ({
    receiving,
    shipment: sel.getShipment(receiving.shipmentId)!,
    warehouse: sel.getWarehouse(receiving.warehouseId)!,
    productCount: fx.receivingItems.filter((i) => i.receivingId === receiving.receivingId).length,
  }));

  if (params.filters?.status) {
    rows = rows.filter((r) => r.receiving.status === params.filters!.status);
  }
  if (params.search) {
    rows = rows.filter((r) =>
      matchesSearch([r.receiving.receivingId, r.shipment.shipmentNo, r.warehouse.name], params.search!),
    );
  }

  rows = sortRows(rows, params.sort, params.sortDir, {
    receivedDate: (r) => r.receiving.receivedDate,
    status: (r) => r.receiving.status,
  });

  return paginate(rows, params.page, params.pageSize);
}

export interface ReceivingDetail {
  receiving: Receiving;
  shipment: Shipment;
  warehouse: Warehouse;
  items: Array<{ item: ReceivingItem; product: Product; variant: ProductVariant }>;
}

export async function getReceivingDetail(receivingId: string): Promise<ReceivingDetail | undefined> {
  await networkDelay();
  const receiving = sel.getReceiving(receivingId);
  if (!receiving) return undefined;

  const items = fx.receivingItems.filter((i) => i.receivingId === receivingId).map((item) => {
    const variant = sel.getVariant(item.variantId)!;
    return { item, product: sel.getProduct(variant.productId)!, variant };
  });

  return {
    receiving,
    shipment: sel.getShipment(receiving.shipmentId)!,
    warehouse: sel.getWarehouse(receiving.warehouseId)!,
    items,
  };
}

// ============================================================ Deliveries ==

export interface DeliveryListRow {
  delivery: Delivery;
  order: Order;
  customer: Customer;
  productCount: number;
}

export type DeliverySort = "deliveryDate" | "status";

export async function listDeliveries(
  params: ListParams<DeliverySort> = {},
): Promise<Page<DeliveryListRow>> {
  await networkDelay();

  let rows: DeliveryListRow[] = fx.deliveries.map((delivery) => {
    const order = sel.getOrder(delivery.orderId)!;
    return {
      delivery,
      order,
      customer: sel.getCustomer(order.customerId)!,
      productCount: fx.deliveryItems.filter((i) => i.deliveryId === delivery.deliveryId).length,
    };
  });

  if (params.filters?.status) {
    rows = rows.filter((r) => r.delivery.status === params.filters!.status);
  }
  if (params.filters?.customerId) {
    rows = rows.filter((r) => r.customer.customerId === params.filters!.customerId);
  }
  if (params.search) {
    rows = rows.filter((r) =>
      matchesSearch([r.delivery.deliveryId, r.order.orderNo, r.customer.name], params.search!),
    );
  }

  rows = sortRows(rows, params.sort, params.sortDir, {
    deliveryDate: (r) => r.delivery.deliveryDate ?? r.delivery.expectedDeliveryDate ?? "",
    status: (r) => r.delivery.status,
  });

  return paginate(rows, params.page, params.pageSize);
}

export interface DeliveryDetail {
  delivery: Delivery;
  order: Order;
  customer: Customer;
  items: Array<{ item: DeliveryItem; product: Product; variant: ProductVariant; source: sel.DeliveryItemSource }>;
}

export async function getDeliveryDetail(deliveryId: string): Promise<DeliveryDetail | undefined> {
  await networkDelay();
  const delivery = fx.deliveries.find((d) => d.deliveryId === deliveryId);
  if (!delivery) return undefined;

  const order = sel.getOrder(delivery.orderId)!;
  const items = fx.deliveryItems
    .filter((i) => i.deliveryId === deliveryId)
    .map((item) => {
      const variant = sel.getVariant(item.variantId)!;
      return {
        item,
        product: sel.getProduct(variant.productId)!,
        variant,
        source: sel.getDeliveryItemSource(item),
      };
    });

  return { delivery, order, customer: sel.getCustomer(order.customerId)!, items };
}

// ============================================================= Inventory ==

export type InventorySort = "product" | "warehouse" | "available" | "quantity";

export async function listInventory(
  params: ListParams<InventorySort> = {},
): Promise<Page<sel.InventoryRow>> {
  await networkDelay();

  let rows = sel.getInventoryRows();

  if (params.filters?.warehouseId) {
    rows = rows.filter((r) => r.warehouse.warehouseId === params.filters!.warehouseId);
  }
  if (params.filters?.lowStock === "true") {
    rows = rows.filter((r) => r.lowStock);
  }
  if (params.search) {
    rows = rows.filter((r) => matchesSearch([r.product.name, r.product.productCode], params.search!));
  }

  rows = sortRows(rows, params.sort, params.sortDir, {
    product: (r) => r.product.name,
    warehouse: (r) => r.warehouse.name,
    available: (r) => r.available,
    quantity: (r) => r.quantity,
  });

  return paginate(rows, params.page, params.pageSize);
}

// ============================================================== Catalogs ==

export async function listCustomers(params: ListParams = {}): Promise<Page<Customer>> {
  await networkDelay();
  let rows = fx.customers;
  if (params.search) {
    rows = rows.filter((c) => matchesSearch([c.name, c.phone, c.address], params.search!));
  }
  return paginate(rows, params.page, params.pageSize);
}

export async function listFactories(params: ListParams = {}): Promise<Page<Factory>> {
  await networkDelay();
  let rows = fx.factories;
  if (params.search) {
    rows = rows.filter((f) => matchesSearch([f.name, f.phone], params.search!));
  }
  return paginate(rows, params.page, params.pageSize);
}

export async function listWarehouses(params: ListParams = {}): Promise<Page<Warehouse>> {
  await networkDelay();
  let rows = fx.warehouses;
  if (params.search) {
    rows = rows.filter((w) => matchesSearch([w.name], params.search!));
  }
  return paginate(rows, params.page, params.pageSize);
}

export async function listProducts(params: ListParams = {}): Promise<Page<Product>> {
  await networkDelay();
  let rows = fx.products;
  if (params.search) {
    rows = rows.filter((p) => matchesSearch([p.name, p.productCode], params.search!));
  }
  return paginate(rows, params.page, params.pageSize);
}

// ===================================================== Customer detail ====

export interface CustomerDetail {
  customer: Customer;
  orders: Order[];
  products: sel.CustomerProductSummary[];
  purchases: Purchase[];
  packages: Package[];
  deliveries: Delivery[];
}

export async function getCustomerDetail(customerId: string): Promise<CustomerDetail | undefined> {
  await networkDelay();
  const customer = fx.customers.find((c) => c.customerId === customerId);
  if (!customer) return undefined;

  return {
    customer,
    orders: sel.getCustomerOrders(customerId),
    products: sel.getCustomerProducts(customerId),
    purchases: sel.getCustomerPurchases(customerId),
    packages: sel.getCustomerPackages(customerId),
    deliveries: sel.getCustomerDeliveries(customerId),
  };
}

// ====================================================== Product detail ====

export interface ProductDetail {
  product: Product;
  variants: ProductVariant[];
  factories: sel.ProductFactorySummary[];
  orders: sel.ProductOrderSummary[];
  inventory: sel.InventoryRow[];
  inTransitShipments: Shipment[];
}

export async function getProductDetail(productId: string): Promise<ProductDetail | undefined> {
  await networkDelay();
  const product = fx.products.find((p) => p.productId === productId);
  if (!product) return undefined;

  return {
    product,
    variants: sel.getVariantsForProduct(productId),
    factories: sel.getProductFactories(productId),
    orders: sel.getProductOrders(productId),
    inventory: sel.getInventoryRows().filter((r) => r.product.productId === productId),
    inTransitShipments: sel.getProductShipmentsInTransit(productId),
  };
}

// ============================================================== Dashboard =

export async function getDashboardData() {
  await networkDelay();
  return {
    stats: sel.getDashboardStats(),
    attention: sel.getOrdersRequiringAttention().map(({ order, attention }) => ({
      order,
      customer: sel.getCustomer(order.customerId)!,
      attention,
    })),
    shipmentActivity: fx.shipments
      .filter((s) => s.status === "in_transit" || s.status === "delayed")
      .map((shipment) => ({ shipment, legs: sel.getShipmentLegs(shipment.shipmentId) })),
  };
}
