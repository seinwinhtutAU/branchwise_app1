import type { Package, PackageItem } from "@/data/types";

export const packages: Package[] = [
  { packageId: "PK-000", packageNo: "PK-000", status: "shipped" },
  { packageId: "PK-001", packageNo: "PK-001", status: "shipped" },
  { packageId: "PK-002", packageNo: "PK-002", status: "preparing" },
  { packageId: "PK-003", packageNo: "PK-003", status: "shipped" },
  { packageId: "PK-004", packageNo: "PK-004", status: "preparing" },
  { packageId: "PK-005", packageNo: "PK-005", status: "shipped" },
  { packageId: "PK-006", packageNo: "PK-006", status: "shipped" },
];

// Each line references the specific purchase-to-order allocation it was
// packed for (see procurement.ts) — not a raw product. That's what lets a
// single package span multiple purchases and multiple customer orders:
// PK-002 packs stock from both PO-002 (for SO-1025) and PO-007 (for
// SO-1050); PK-004 packs the same purchased batch of Khaki Pants split
// across two different customers, SO-1035 and SO-1050.
export const packageItems: PackageItem[] = [
  { packageItemId: "PKI-000-1", packageId: "PK-000", purchaseAllocationId: "PA-1", quantity: 60 },
  { packageItemId: "PKI-000-2", packageId: "PK-000", purchaseAllocationId: "PA-2", quantity: 20 },

  { packageItemId: "PKI-001-1", packageId: "PK-001", purchaseAllocationId: "PA-3", quantity: 40 },
  { packageItemId: "PKI-001-2", packageId: "PK-001", purchaseAllocationId: "PA-4", quantity: 30 },

  { packageItemId: "PKI-002-1", packageId: "PK-002", purchaseAllocationId: "PA-5", quantity: 60 },
  { packageItemId: "PKI-002-2", packageId: "PK-002", purchaseAllocationId: "PA-6", quantity: 40 },
  { packageItemId: "PKI-002-3", packageId: "PK-002", purchaseAllocationId: "PA-17", quantity: 20 },

  { packageItemId: "PKI-003-1", packageId: "PK-003", purchaseAllocationId: "PA-7", quantity: 30 },
  { packageItemId: "PKI-003-2", packageId: "PK-003", purchaseAllocationId: "PA-8", quantity: 15 },
  { packageItemId: "PKI-003-3", packageId: "PK-003", purchaseAllocationId: "PA-9", quantity: 10 },

  { packageItemId: "PKI-004-1", packageId: "PK-004", purchaseAllocationId: "PA-10", quantity: 50 },
  { packageItemId: "PKI-004-2", packageId: "PK-004", purchaseAllocationId: "PA-16", quantity: 25 },
  { packageItemId: "PKI-004-3", packageId: "PK-004", purchaseAllocationId: "PA-11", quantity: 100 },

  { packageItemId: "PKI-005-1", packageId: "PK-005", purchaseAllocationId: "PA-12", quantity: 70 },
  { packageItemId: "PKI-005-2", packageId: "PK-005", purchaseAllocationId: "PA-13", quantity: 35 },

  { packageItemId: "PKI-006-1", packageId: "PK-006", purchaseAllocationId: "PA-14", quantity: 60 },
  { packageItemId: "PKI-006-2", packageId: "PK-006", purchaseAllocationId: "PA-15", quantity: 45 },
];
