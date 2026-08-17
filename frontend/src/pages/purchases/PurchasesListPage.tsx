import React, { useState } from "react";
import { PackageSearch, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CreatePurchaseDrawer } from "@/components/domain/CreatePurchaseDrawer";
import * as fx from "@/data/fixtures";
import { listPurchases, type PurchaseListRow, type PurchaseSort } from "@/data/repository";
import { useListQuery } from "@/hooks/useListQuery";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const FACTORY_OPTIONS = fx.factories.map((f) => ({ value: f.factoryId, label: f.name }));
const CUSTOMER_OPTIONS = fx.customers.map((c) => ({ value: c.customerId, label: c.name }));

export function PurchasesListPage() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const list = useListQuery<PurchaseListRow, PurchaseSort>({
    key: "purchases",
    fetcher: listPurchases,
    defaultSort: "purchaseDate",
  });

  const columns: DataTableColumn<PurchaseListRow>[] = [
    {
      id: "factory",
      header: "Factory",
      cell: (r) => (
        <div>
          <p className="font-medium text-neutral-800">{r.factory.name}</p>
          <p className="text-xs text-neutral-400">{r.purchase.purchaseNo}</p>
        </div>
      ),
    },
    { id: "products", header: "Products", cell: (r) => `${r.productCount} products` },
    { id: "quantity", header: "Quantity", align: "right", cell: (r) => r.totalQuantity },
    {
      id: "cost",
      header: "Cost",
      align: "right",
      cell: (r) => formatCurrency(r.totalCost, r.purchase.currencyCode),
    },
    { id: "status", header: "Status", sortable: true, cell: (r) => <StatusBadge status={r.purchase.status} /> },
    { id: "purchaseDate", header: "Date", sortable: true, cell: (r) => formatDate(r.purchase.purchaseDate) },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Purchases</h1>
          <p className="text-sm text-neutral-500">Stock ordered from factories to fulfill customer orders.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setDrawerOpen(true)}>
          New Purchase
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search purchases..." className="w-72" />
        <FilterBar>
          <FilterSelect
            label="Customer"
            value={list.filters.customerId}
            options={CUSTOMER_OPTIONS}
            onChange={(v) => list.setFilter("customerId", v)}
          />
          <FilterSelect
            label="Factory"
            value={list.filters.factoryId}
            options={FACTORY_OPTIONS}
            onChange={(v) => list.setFilter("factoryId", v)}
          />
          <FilterSelect
            label="Status"
            value={list.filters.status}
            options={STATUS_OPTIONS}
            onChange={(v) => list.setFilter("status", v)}
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={list.data?.rows ?? []}
        rowKey={(r) => r.purchase.purchaseId}
        loading={list.isLoading}
        sort={list.sort}
        sortDir={list.sortDir}
        onSortChange={list.onSortChange}
        onRowClick={(r) => navigate(`/purchases/${r.purchase.purchaseId}`)}
        emptyState={
          <EmptyState
            icon={PackageSearch}
            title="No purchases yet"
            description="Create a purchase to order stock from a factory."
            action={
              <Button variant="primary" onClick={() => setDrawerOpen(true)}>
                New Purchase
              </Button>
            }
          />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}

      <CreatePurchaseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={list.refetch} />
    </div>
  );
}
