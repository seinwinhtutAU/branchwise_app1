import type { Receiving, ReceivingItem } from "@/data/types";

export const receivings: Receiving[] = [
  { receivingId: "RC-000", shipmentId: "SH-000", warehouseId: "WH-2", receivedDate: "2026-08-06", status: "completed" },
  { receivingId: "RC-001", shipmentId: "SH-003", warehouseId: "WH-2", receivedDate: "2026-08-09", status: "completed" },
  { receivingId: "RC-002", shipmentId: "SH-004", warehouseId: "WH-1", receivedDate: "2026-08-11", status: "completed" },
];

export const receivingItems: ReceivingItem[] = [
  { receivingItemId: "RI-000-1", receivingId: "RC-000", productId: "PROD-1", quantityExpected: 60, quantityReceived: 60 },
  { receivingItemId: "RI-000-2", receivingId: "RC-000", productId: "PROD-3", quantityExpected: 20, quantityReceived: 20 },

  { receivingItemId: "RI-001-1", receivingId: "RC-001", productId: "PROD-4", quantityExpected: 30, quantityReceived: 30 },
  { receivingItemId: "RI-001-2", receivingId: "RC-001", productId: "PROD-8", quantityExpected: 15, quantityReceived: 15 },
  { receivingItemId: "RI-001-3", receivingId: "RC-001", productId: "PROD-5", quantityExpected: 10, quantityReceived: 10 },

  { receivingItemId: "RI-002-1", receivingId: "RC-002", productId: "PROD-2", quantityExpected: 60, quantityReceived: 60 },
  { receivingItemId: "RI-002-2", receivingId: "RC-002", productId: "PROD-9", quantityExpected: 45, quantityReceived: 45 },
];
