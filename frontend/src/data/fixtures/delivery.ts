import type { Delivery, DeliveryItem } from "@/data/types";

export const deliveries: Delivery[] = [
  { deliveryId: "DL-000", orderId: "SO-1024", deliveryDate: "2026-08-12", status: "delivered" },
  { deliveryId: "DL-001", orderId: "SO-1026", deliveryDate: "2026-08-15", status: "delivered" },
];

export const deliveryItems: DeliveryItem[] = [
  { deliveryItemId: "DLI-000-1", deliveryId: "DL-000", productId: "PROD-1", quantity: 60 },
  { deliveryItemId: "DLI-000-2", deliveryId: "DL-000", productId: "PROD-3", quantity: 20 },

  { deliveryItemId: "DLI-001-1", deliveryId: "DL-001", productId: "PROD-4", quantity: 30 },
  { deliveryItemId: "DLI-001-2", deliveryId: "DL-001", productId: "PROD-8", quantity: 15 },
  { deliveryItemId: "DLI-001-3", deliveryId: "DL-001", productId: "PROD-5", quantity: 10 },
];
