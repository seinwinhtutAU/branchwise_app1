import React from "react";
import { Warehouse as WarehouseIcon } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { getInventoryRows } from "@/data/selectors";
import { listWarehouses } from "@/data/repository";
import type { Warehouse } from "@/data/types";
import { useListQuery } from "@/hooks/useListQuery";

export function WarehousesListPage() {
  const list = useListQuery<Warehouse>({ key: "warehouses", fetcher: listWarehouses });
  const inventoryRows = getInventoryRows();

  const columns: DataTableColumn<Warehouse>[] = [
    { id: "name", header: "Warehouse", cell: (w) => <span className="font-medium text-neutral-800">{w.name}</span> },
    {
      id: "skus",
      header: "Products Stocked",
      cell: (w) => inventoryRows.filter((r) => r.warehouse.warehouseId === w.warehouseId).length,
    },
    {
      id: "units",
      header: "Total Units",
      align: "right",
      cell: (w) =>
        inventoryRows
          .filter((r) => r.warehouse.warehouseId === w.warehouseId)
          .reduce((sum, r) => sum + r.quantity, 0),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Warehouses</h1>
        <p className="text-sm text-neutral-500">Storage locations where inventory is held.</p>
      </div>

      <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search warehouses..." className="mb-3 w-72" />

      <DataTable
        columns={columns}
        data={list.data?.rows ?? []}
        rowKey={(w) => w.warehouseId}
        loading={list.isLoading}
        emptyState={
          <EmptyState icon={WarehouseIcon} title="No warehouses found" description="Try a different search." />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
