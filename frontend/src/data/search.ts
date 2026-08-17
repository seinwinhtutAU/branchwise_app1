import * as fx from "@/data/fixtures";
import * as sel from "@/data/selectors";

export interface SearchResult {
  group: string;
  id: string;
  label: string;
  sublabel: string;
  path: string;
}

// label is always the human-readable match (customer/factory/product/route);
// sublabel carries the internal reference number as secondary context — a
// user should never need to know SO-/PO-/PK-/SH- codes to find something.
function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const order of fx.orders) {
    const customer = sel.getCustomer(order.customerId);
    results.push({
      group: "Orders",
      id: order.orderId,
      label: customer?.name ?? "Unknown customer",
      sublabel: order.orderNo,
      path: `/orders/${order.orderId}`,
    });
  }

  for (const customer of fx.customers) {
    results.push({
      group: "Customers",
      id: customer.customerId,
      label: customer.name,
      sublabel: customer.address ?? "",
      path: `/customers/${customer.customerId}`,
    });
  }

  for (const product of fx.products) {
    results.push({
      group: "Products",
      id: product.productId,
      label: product.name,
      sublabel: product.productCode,
      path: `/products/${product.productId}`,
    });
  }

  for (const purchase of fx.purchases) {
    const factory = sel.getFactory(purchase.factoryId);
    results.push({
      group: "Purchases",
      id: purchase.purchaseId,
      label: factory?.name ?? "Unknown factory",
      sublabel: purchase.purchaseNo,
      path: `/purchases/${purchase.purchaseId}`,
    });
  }

  for (const pkg of fx.packages) {
    const customerNames = Array.from(new Set(sel.getPackageItemDetails(pkg.packageId).map((d) => d.customer.name)));
    results.push({
      group: "Packages",
      id: pkg.packageId,
      label: customerNames.length > 0 ? customerNames.join(", ") : "Empty package",
      sublabel: pkg.packageNo,
      path: `/packages/${pkg.packageId}`,
    });
  }

  for (const shipment of fx.shipments) {
    results.push({
      group: "Shipments",
      id: shipment.shipmentId,
      label: `${shipment.origin} → ${shipment.destination}`,
      sublabel: shipment.shipmentNo,
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
