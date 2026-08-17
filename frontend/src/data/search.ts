import * as fx from "@/data/fixtures";
import * as sel from "@/data/selectors";

export interface SearchResult {
  group: string;
  id: string;
  label: string;
  sublabel: string;
  path: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const order of fx.orders) {
    const customer = sel.getCustomer(order.customerId);
    results.push({
      group: "Orders",
      id: order.orderId,
      label: order.orderNo,
      sublabel: customer?.name ?? "",
      path: `/orders/${order.orderId}`,
    });
  }

  for (const customer of fx.customers) {
    results.push({
      group: "Customers",
      id: customer.customerId,
      label: customer.name,
      sublabel: customer.address ?? "",
      path: `/customers`,
    });
  }

  for (const product of fx.products) {
    results.push({
      group: "Products",
      id: product.productId,
      label: product.name,
      sublabel: product.productCode,
      path: `/products`,
    });
  }

  for (const purchase of fx.purchases) {
    const factory = sel.getFactory(purchase.factoryId);
    results.push({
      group: "Purchases",
      id: purchase.purchaseId,
      label: purchase.purchaseNo,
      sublabel: factory?.name ?? "",
      path: `/purchases/${purchase.purchaseId}`,
    });
  }

  for (const pkg of fx.packages) {
    const purchaseNos = Array.from(new Set(sel.getPackageItemDetails(pkg.packageId).map((d) => d.purchase.purchaseNo)));
    results.push({
      group: "Packages",
      id: pkg.packageId,
      label: pkg.packageNo,
      sublabel: purchaseNos.length > 0 ? `From ${purchaseNos.join(", ")}` : "",
      path: `/packages/${pkg.packageId}`,
    });
  }

  for (const shipment of fx.shipments) {
    results.push({
      group: "Shipments",
      id: shipment.shipmentId,
      label: shipment.shipmentNo,
      sublabel: `${shipment.origin} → ${shipment.destination}`,
      path: `/shipments/${shipment.shipmentId}`,
    });
  }

  for (const warehouse of fx.warehouses) {
    results.push({
      group: "Warehouses",
      id: warehouse.warehouseId,
      label: warehouse.name,
      sublabel: "Warehouse",
      path: `/warehouses`,
    });
  }

  for (const factory of fx.factories) {
    results.push({
      group: "Factories",
      id: factory.factoryId,
      label: factory.name,
      sublabel: "Factory",
      path: `/factories`,
    });
  }

  return results;
}

let cachedIndex: SearchResult[] | null = null;

export function searchAll(query: string): SearchResult[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return cachedIndex
    .filter((r) => r.label.toLowerCase().includes(q) || r.sublabel.toLowerCase().includes(q))
    .slice(0, 30);
}
