import type { Purchase, PurchaseAllocation, PurchaseItem } from "@/data/types";

export const purchases: Purchase[] = [
  { purchaseId: "PO-000", purchaseNo: "PO-000", factoryId: "FAC-1", purchaseDate: "2026-08-01", status: "completed", currencyCode: "THB" },
  { purchaseId: "PO-001", purchaseNo: "PO-001", factoryId: "FAC-2", purchaseDate: "2026-08-14", status: "completed", currencyCode: "VND" },
  { purchaseId: "PO-002", purchaseNo: "PO-002", factoryId: "FAC-2", purchaseDate: "2026-08-16", status: "processing", currencyCode: "VND" },
  { purchaseId: "PO-003", purchaseNo: "PO-003", factoryId: "FAC-3", purchaseDate: "2026-08-05", status: "completed", currencyCode: "BDT" },
  { purchaseId: "PO-004", purchaseNo: "PO-004", factoryId: "FAC-1", purchaseDate: "2026-08-13", status: "processing", currencyCode: "THB" },
  { purchaseId: "PO-005", purchaseNo: "PO-005", factoryId: "FAC-3", purchaseDate: "2026-08-11", status: "completed", currencyCode: "BDT" },
  { purchaseId: "PO-006", purchaseNo: "PO-006", factoryId: "FAC-4", purchaseDate: "2026-08-08", status: "completed", currencyCode: "CNY" },
  { purchaseId: "PO-007", purchaseNo: "PO-007", factoryId: "FAC-1", purchaseDate: "2026-08-17", status: "processing", currencyCode: "THB" },
  { purchaseId: "PO-008", purchaseNo: "PO-008", factoryId: "FAC-1", purchaseDate: "2026-08-15", status: "completed", currencyCode: "THB" },
];

// buyingPrice is in the parent purchase's currency (see Purchase.currencyCode).
export const purchaseItems: PurchaseItem[] = [
  { purchaseItemId: "PI-000-1", purchaseId: "PO-000", variantId: "PV-1", quantity: 60, buyingPrice: 315 },
  { purchaseItemId: "PI-000-2", purchaseId: "PO-000", variantId: "PV-3", quantity: 20, buyingPrice: 910 },

  { purchaseItemId: "PI-001-1", purchaseId: "PO-001", variantId: "PV-1", quantity: 40, buyingPrice: 225000 },
  { purchaseItemId: "PI-001-2", purchaseId: "PO-001", variantId: "PV-2", quantity: 30, buyingPrice: 275000 },

  { purchaseItemId: "PI-002-1", purchaseId: "PO-002", variantId: "PV-4", quantity: 60, buyingPrice: 125000 },
  { purchaseItemId: "PI-002-2", purchaseId: "PO-002", variantId: "PV-6", quantity: 40, buyingPrice: 375000 },

  { purchaseItemId: "PI-003-1", purchaseId: "PO-003", variantId: "PV-4", quantity: 30, buyingPrice: 550 },
  { purchaseItemId: "PI-003-2", purchaseId: "PO-003", variantId: "PV-8", quantity: 15, buyingPrice: 1100 },
  { purchaseItemId: "PI-003-3", purchaseId: "PO-003", variantId: "PV-5", quantity: 10, buyingPrice: 3520 },

  { purchaseItemId: "PI-004-1", purchaseId: "PO-004", variantId: "PV-6", quantity: 75, buyingPrice: 525 },
  { purchaseItemId: "PI-004-2", purchaseId: "PO-004", variantId: "PV-7", quantity: 100, buyingPrice: 140 },

  { purchaseItemId: "PI-005-1", purchaseId: "PO-005", variantId: "PV-1", quantity: 70, buyingPrice: 990 },
  { purchaseItemId: "PI-005-2", purchaseId: "PO-005", variantId: "PV-3", quantity: 35, buyingPrice: 2860 },

  { purchaseItemId: "PI-006-1", purchaseId: "PO-006", variantId: "PV-2", quantity: 60, buyingPrice: 77 },
  { purchaseItemId: "PI-006-2", purchaseId: "PO-006", variantId: "PV-9", quantity: 45, buyingPrice: 98 },

  { purchaseItemId: "PI-007-1", purchaseId: "PO-007", variantId: "PV-10", quantity: 20, buyingPrice: 1330 },

  // Shipped straight to the customer — never packaged or received into a warehouse.
  { purchaseItemId: "PI-008-1", purchaseId: "PO-008", variantId: "PV-9", quantity: 80, buyingPrice: 490 },
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

  { allocationId: "PA-18", purchaseItemId: "PI-008-1", orderItemId: "OI-1031-1", quantity: 80 },
];
