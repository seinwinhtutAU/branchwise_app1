import React from "react";
import { AlertTriangle, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import * as fx from "@/data/fixtures";
import { listInventory, type InventorySort } from "@/data/repository";
import type { InventoryRow } from "@/data/selectors";
import { useListQuery } from "@/hooks/useListQuery";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

const WAREHOUSE_OPTIONS = fx.warehouses.map((w) => ({ value: w.warehouseId, label: w.name }));

export function InventoryPage() {
  const list = useListQuery<InventoryRow, InventorySort>({
    key: "inventory",
    fetcher: listInventory,
    defaultSort: "product",
  });

  const lowStockActive = list.filters.lowStock === "true";

  const columns: DataTableColumn<InventoryRow>[] = [
    {
      id: "product",
      header: "Product",
      sortable: true,
      cell: (r) => (
        <div>
          <p className="font-medium text-neutral-800">{r.product.name}</p>
          <p className="text-xs text-neutral-400">{r.product.productCode}</p>
        </div>
      ),
    },
    { id: "warehouse", header: "Warehouse", sortable: true, cell: (r) => r.warehouse.name },
    { id: "quantity", header: "On Hand", sortable: true, align: "right", cell: (r) => formatNumber(r.quantity) },
    {
      id: "reserved",
      header: "Reserved",
      align: "right",
      cell: (r) => <span className="text-neutral-500">{formatNumber(r.reserved)}</span>,
    },
    {
      id: "incoming",
      header: "Incoming",
      align: "right",
      cell: (r) =>
        r.incoming > 0 ? (
          <span className="text-info-600">+{formatNumber(r.incoming)}</span>
        ) : (
          <span className="text-neutral-300">—</span>
        ),
    },
    {
      id: "available",
      header: "Available",
      sortable: true,
      align: "right",
      cell: (r) => (
        <span className={cn("font-semibold", r.lowStock ? "text-danger-600" : "text-neutral-800")}>
          {formatNumber(r.available)}
        </span>
      ),
    },
    {
      id: "expected",
      header: "Expected Available",
      align: "right",
      cell: (r) => <span className="text-neutral-500">{formatNumber(r.expectedAvailable)}</span>,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Inventory</h1>
        <p className="text-sm text-neutral-500">
          Available = On Hand − Reserved · Expected Available = Available + Incoming
        </p>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search products..." className="w-72" />
        <FilterBar>
          <FilterSelect
            label="Warehouse"
            value={list.filters.warehouseId}
            options={WAREHOUSE_OPTIONS}
            onChange={(v) => list.setFilter("warehouseId", v)}
          />
          <Button
            variant={lowStockActive ? "primary" : "secondary"}
            size="sm"
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            onClick={() => list.setFilter("lowStock", lowStockActive ? undefined : "true")}
          >
            Low Stock
          </Button>
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={list.data?.rows ?? []}
        rowKey={(r) => r.inventoryId}
        loading={list.isLoading}
        sort={list.sort}
        sortDir={list.sortDir}
        onSortChange={list.onSortChange}
        emptyState={
          <EmptyState
            icon={LayoutGrid}
            title="No inventory records"
            description="Stock levels will appear here once goods are received into a warehouse."
          />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
