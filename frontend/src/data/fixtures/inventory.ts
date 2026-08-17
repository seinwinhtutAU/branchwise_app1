import type { Inventory, StockAllocation } from "@/data/types";

export const inventory: Inventory[] = [
  { inventoryId: "INV-1", warehouseId: "WH-1", productId: "PROD-2", quantity: 60, reservedQuantity: 60, incomingQuantity: 0 },
  { inventoryId: "INV-2", warehouseId: "WH-1", productId: "PROD-9", quantity: 45, reservedQuantity: 45, incomingQuantity: 0 },
  { inventoryId: "INV-3", warehouseId: "WH-2", productId: "PROD-1", quantity: 120, reservedQuantity: 25, incomingQuantity: 40 },
  { inventoryId: "INV-4", warehouseId: "WH-2", productId: "PROD-2", quantity: 8, reservedQuantity: 0, incomingQuantity: 30 },
  { inventoryId: "INV-5", warehouseId: "WH-3", productId: "PROD-4", quantity: 45, reservedQuantity: 10, incomingQuantity: 0 },
  { inventoryId: "INV-6", warehouseId: "WH-1", productId: "PROD-6", quantity: 5, reservedQuantity: 0, incomingQuantity: 0 },
  { inventoryId: "INV-7", warehouseId: "WH-1", productId: "PROD-10", quantity: 2, reservedQuantity: 0, incomingQuantity: 0 },
  { inventoryId: "INV-8", warehouseId: "WH-2", productId: "PROD-8", quantity: 60, reservedQuantity: 5, incomingQuantity: 0 },
  { inventoryId: "INV-9", warehouseId: "WH-3", productId: "PROD-7", quantity: 80, reservedQuantity: 0, incomingQuantity: 0 },
  { inventoryId: "INV-10", warehouseId: "WH-2", productId: "PROD-5", quantity: 18, reservedQuantity: 0, incomingQuantity: 0 },
];

export const stockAllocations: StockAllocation[] = [
  { allocationId: "SA-1", orderItemId: "OI-1048-1", inventoryId: "INV-1", quantity: 60 },
  { allocationId: "SA-2", orderItemId: "OI-1048-2", inventoryId: "INV-2", quantity: 45 },
];
