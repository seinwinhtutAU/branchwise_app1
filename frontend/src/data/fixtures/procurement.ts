import type { Purchase, PurchaseAllocation, PurchaseItem } from "@/data/types";

export const purchases: Purchase[] = [
  { purchaseId: "PO-000", purchaseNo: "PO-000", factoryId: "FAC-1", purchaseDate: "2026-08-01", status: "completed" },
  { purchaseId: "PO-001", purchaseNo: "PO-001", factoryId: "FAC-2", purchaseDate: "2026-08-14", status: "completed" },
  { purchaseId: "PO-002", purchaseNo: "PO-002", factoryId: "FAC-2", purchaseDate: "2026-08-16", status: "processing" },
  { purchaseId: "PO-003", purchaseNo: "PO-003", factoryId: "FAC-3", purchaseDate: "2026-08-05", status: "completed" },
  { purchaseId: "PO-004", purchaseNo: "PO-004", factoryId: "FAC-1", purchaseDate: "2026-08-13", status: "processing" },
  { purchaseId: "PO-005", purchaseNo: "PO-005", factoryId: "FAC-3", purchaseDate: "2026-08-11", status: "completed" },
  { purchaseId: "PO-006", purchaseNo: "PO-006", factoryId: "FAC-4", purchaseDate: "2026-08-08", status: "completed" },
  { purchaseId: "PO-007", purchaseNo: "PO-007", factoryId: "FAC-1", purchaseDate: "2026-08-17", status: "processing" },
];

export const purchaseItems: PurchaseItem[] = [
  { purchaseItemId: "PI-000-1", purchaseId: "PO-000", productId: "PROD-1", quantity: 60, buyingPrice: 9 },
  { purchaseItemId: "PI-000-2", purchaseId: "PO-000", productId: "PROD-3", quantity: 20, buyingPrice: 26 },

  { purchaseItemId: "PI-001-1", purchaseId: "PO-001", productId: "PROD-1", quantity: 40, buyingPrice: 9 },
  { purchaseItemId: "PI-001-2", purchaseId: "PO-001", productId: "PROD-2", quantity: 30, buyingPrice: 11 },

  { purchaseItemId: "PI-002-1", purchaseId: "PO-002", productId: "PROD-4", quantity: 60, buyingPrice: 5 },
  { purchaseItemId: "PI-002-2", purchaseId: "PO-002", productId: "PROD-6", quantity: 40, buyingPrice: 15 },

  { purchaseItemId: "PI-003-1", purchaseId: "PO-003", productId: "PROD-4", quantity: 30, buyingPrice: 5 },
  { purchaseItemId: "PI-003-2", purchaseId: "PO-003", productId: "PROD-8", quantity: 15, buyingPrice: 10 },
  { purchaseItemId: "PI-003-3", purchaseId: "PO-003", productId: "PROD-5", quantity: 10, buyingPrice: 32 },

  { purchaseItemId: "PI-004-1", purchaseId: "PO-004", productId: "PROD-6", quantity: 75, buyingPrice: 15 },
  { purchaseItemId: "PI-004-2", purchaseId: "PO-004", productId: "PROD-7", quantity: 100, buyingPrice: 4 },

  { purchaseItemId: "PI-005-1", purchaseId: "PO-005", productId: "PROD-1", quantity: 70, buyingPrice: 9 },
  { purchaseItemId: "PI-005-2", purchaseId: "PO-005", productId: "PROD-3", quantity: 35, buyingPrice: 26 },

  { purchaseItemId: "PI-006-1", purchaseId: "PO-006", productId: "PROD-2", quantity: 60, buyingPrice: 11 },
  { purchaseItemId: "PI-006-2", purchaseId: "PO-006", productId: "PROD-9", quantity: 45, buyingPrice: 14 },

  { purchaseItemId: "PI-007-1", purchaseId: "PO-007", productId: "PROD-10", quantity: 20, buyingPrice: 38 },
];

export const purchaseAllocations: PurchaseAllocation[] = [
  { allocationId: "PA-1", purchaseItemId: "PI-000-1", orderItemId: "OI-1024-1", quantity: 60 },
  { allocationId: "PA-2", purchaseItemId: "PI-000-2", orderItemId: "OI-1024-3", quantity: 20 },
  { allocationId: "PA-3", purchaseItemId: "PI-001-1", orderItemId: "OI-1024-1", quantity: 40 },
  { allocationId: "PA-4", purchaseItemId: "PI-001-2", orderItemId: "OI-1024-2", quantity: 30 },

  { allocationId: "PA-5", purchaseItemId: "PI-002-1", orderItemId: "OI-1025-1", quantity: 60 },
  { allocationId: "PA-6", purchaseItemId: "PI-002-2", orderItemId: "OI-1025-3", quantity: 40 },

  { allocationId: "PA-7", purchaseItemId: "PI-003-1", orderItemId: "OI-1026-1", quantity: 30 },
  { allocationId: "PA-8", purchaseItemId: "PI-003-2", orderItemId: "OI-1026-2", quantity: 15 },
  { allocationId: "PA-9", purchaseItemId: "PI-003-3", orderItemId: "OI-1026-3", quantity: 10 },

  { allocationId: "PA-10", purchaseItemId: "PI-004-1", orderItemId: "OI-1035-1", quantity: 50 },
  { allocationId: "PA-11", purchaseItemId: "PI-004-2", orderItemId: "OI-1035-2", quantity: 100 },
  { allocationId: "PA-16", purchaseItemId: "PI-004-1", orderItemId: "OI-1050-3", quantity: 25 },

  { allocationId: "PA-12", purchaseItemId: "PI-005-1", orderItemId: "OI-1042-1", quantity: 70 },
  { allocationId: "PA-13", purchaseItemId: "PI-005-2", orderItemId: "OI-1042-2", quantity: 35 },

  { allocationId: "PA-14", purchaseItemId: "PI-006-1", orderItemId: "OI-1048-1", quantity: 60 },
  { allocationId: "PA-15", purchaseItemId: "PI-006-2", orderItemId: "OI-1048-2", quantity: 45 },

  { allocationId: "PA-17", purchaseItemId: "PI-007-1", orderItemId: "OI-1050-2", quantity: 20 },
];
