// Mirrors backend/app/db/models (SQLAlchemy). Field names are camelCased for
// idiomatic TS; the eventual API adapter maps snake_case JSON to these shapes.

export type OrderStatus =
  | "draft"
  | "pending"
  | "processing"
  | "partially_fulfilled"
  | "fulfilled"
  | "cancelled";

export type PurchaseStatus = "pending" | "processing" | "completed" | "cancelled";

export type PackageStatus = "preparing" | "ready" | "shipped";

export type ShipmentStatus = "pending" | "in_transit" | "delayed" | "arrived";

export type TransportationLegStatus = "pending" | "in_transit" | "delayed" | "completed";

export type ReceivingStatus = "pending" | "in_progress" | "completed";

export type DeliveryStatus = "pending" | "in_transit" | "delivered" | "cancelled";

export interface Customer {
  customerId: string;
  name: string;
  phone: string | null;
  address: string | null;
}

// A style/design, identified by productCode. Not directly orderable — see
// ProductVariant, which is the color/group combination that actually gets
// ordered, purchased, stocked, received, and delivered.
export interface Product {
  productId: string;
  productCode: string;
  name: string;
}

// color/groupName may both be unset when a variant isn't split that way.
export interface ProductVariant {
  variantId: string;
  productId: string;
  color: string | null;
  groupName: string | null;
}

export interface Factory {
  factoryId: string;
  name: string;
  phone: string | null;
}

export interface Warehouse {
  warehouseId: string;
  name: string;
}

// Current rate to convert 1 unit of currencyCode into the base reporting
// currency (MMK). Global and single-valued, not a historical time series.
export interface ExchangeRate {
  currencyCode: string;
  rateToBase: number;
}

export interface Order {
  orderId: string;
  orderNo: string;
  customerId: string;
  orderDate: string;
  source: string | null;
  status: OrderStatus;
  totalAmount: number;
  currencyCode: string;
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  purchaseId: string;
  purchaseNo: string;
  factoryId: string;
  purchaseDate: string;
  status: PurchaseStatus;
  currencyCode: string;
}

export interface PurchaseItem {
  purchaseItemId: string;
  purchaseId: string;
  variantId: string;
  quantity: number;
  buyingPrice: number;
}

export interface PurchaseAllocation {
  allocationId: string;
  purchaseItemId: string;
  orderItemId: string;
  quantity: number;
}

export interface Package {
  packageId: string;
  packageNo: string;
  status: PackageStatus;
}

// A packed quantity set aside for one customer order (a PurchaseAllocation),
// not a raw product+purchase — packing follows the shipment/destination, so
// a package can hold items from several purchases and several customer
// orders. See PurchaseAllocation.
export interface PackageItem {
  packageItemId: string;
  packageId: string;
  purchaseAllocationId: string;
  quantity: number;
}

export interface Shipment {
  shipmentId: string;
  shipmentNo: string;
  shipmentDate: string;
  expectedArrival: string | null;
  status: ShipmentStatus;
  origin: string;
  destination: string;
}

export interface ShipmentPackage {
  shipmentPackageId: string;
  shipmentId: string;
  packageId: string;
}

export interface TransportationLeg {
  legId: string;
  shipmentId: string;
  fromLocation: string;
  toLocation: string;
  carrier: string | null;
  vehicleNo: string | null;
  departureDate: string | null;
  arrivalDate: string | null;
  transportCost: number | null;
  status: TransportationLegStatus;
  // Checkpoint verification for goods arriving at this leg's destination.
  // Shipments are a straight line, so this lives on the leg rather than a
  // separate receiving-style entity — Receiving stays reserved for arrivals
  // at a real warehouse (see Receiving).
  checkedBy: string | null;
  checkedDate: string | null;
  packagesExpected: number | null;
  packagesVerified: number | null;
  checkNotes: string | null;
}

export interface Receiving {
  receivingId: string;
  shipmentId: string;
  warehouseId: string;
  receivedDate: string;
  status: ReceivingStatus;
}

export interface ReceivingItem {
  receivingItemId: string;
  receivingId: string;
  variantId: string;
  quantityExpected: number;
  quantityReceived: number;
}

export interface Inventory {
  inventoryId: string;
  warehouseId: string;
  variantId: string;
  quantity: number;
  reservedQuantity: number;
  incomingQuantity: number;
}

export interface StockAllocation {
  allocationId: string;
  orderItemId: string;
  inventoryId: string;
  quantity: number;
}

export interface Delivery {
  deliveryId: string;
  orderId: string;
  // expectedDeliveryDate is the target set when scheduling. deliveryDate is
  // only filled in once the delivery is actually confirmed — it isn't a
  // promise, so the two are tracked separately (mirrors Shipment.expectedArrival).
  expectedDeliveryDate: string | null;
  deliveryDate: string | null;
  status: DeliveryStatus;
}

// Exactly one of stockAllocationId / purchaseAllocationId is set, depending
// on how this line was fulfilled: from warehouse stock, or shipped straight
// from a purchase to the customer without ever passing through a warehouse.
export interface DeliveryItem {
  deliveryItemId: string;
  deliveryId: string;
  variantId: string;
  quantity: number;
  stockAllocationId: string | null;
  purchaseAllocationId: string | null;
}
