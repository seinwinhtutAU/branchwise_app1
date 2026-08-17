import type { Delivery, DeliveryItem } from "@/data/types";

export const deliveries: Delivery[] = [
  {
    deliveryId: "DL-000",
    orderId: "SO-1024",
    expectedDeliveryDate: "2026-08-12",
    deliveryDate: "2026-08-12",
    status: "delivered",
  },
  {
    deliveryId: "DL-001",
    orderId: "SO-1026",
    expectedDeliveryDate: "2026-08-14",
    deliveryDate: "2026-08-15",
    status: "delivered",
  },
  {
    deliveryId: "DL-002",
    orderId: "SO-1048",
    expectedDeliveryDate: "2026-08-22",
    deliveryDate: null,
    status: "pending",
  },
  {
    deliveryId: "DL-003",
    orderId: "SO-1031",
    expectedDeliveryDate: "2026-08-18",
    deliveryDate: "2026-08-18",
    status: "delivered",
  },
];

export const deliveryItems: DeliveryItem[] = [
  // Sourcing not tracked for these older deliveries.
  {
    deliveryItemId: "DLI-000-1",
    deliveryId: "DL-000",
    variantId: "PV-1",
    quantity: 60,
    stockAllocationId: null,
    purchaseAllocationId: null,
  },
  {
    deliveryItemId: "DLI-000-2",
    deliveryId: "DL-000",
    variantId: "PV-3",
    quantity: 20,
    stockAllocationId: null,
    purchaseAllocationId: null,
  },

  {
    deliveryItemId: "DLI-001-1",
    deliveryId: "DL-001",
    variantId: "PV-4",
    quantity: 30,
    stockAllocationId: null,
    purchaseAllocationId: null,
  },
  {
    deliveryItemId: "DLI-001-2",
    deliveryId: "DL-001",
    variantId: "PV-8",
    quantity: 15,
    stockAllocationId: null,
    purchaseAllocationId: null,
  },
  {
    deliveryItemId: "DLI-001-3",
    deliveryId: "DL-001",
    variantId: "PV-5",
    quantity: 10,
    stockAllocationId: null,
    purchaseAllocationId: null,
  },

  // Fulfilled from Bangkok Warehouse stock reserved via SA-1 / SA-2.
  {
    deliveryItemId: "DLI-002-1",
    deliveryId: "DL-002",
    variantId: "PV-2",
    quantity: 60,
    stockAllocationId: "SA-1",
    purchaseAllocationId: null,
  },
  {
    deliveryItemId: "DLI-002-2",
    deliveryId: "DL-002",
    variantId: "PV-9",
    quantity: 45,
    stockAllocationId: "SA-2",
    purchaseAllocationId: null,
  },

  // Shipped straight from PO-008 (Bangkok Textile Co.) — never warehoused.
  {
    deliveryItemId: "DLI-003-1",
    deliveryId: "DL-003",
    variantId: "PV-9",
    quantity: 80,
    stockAllocationId: null,
    purchaseAllocationId: "PA-18",
  },
];
