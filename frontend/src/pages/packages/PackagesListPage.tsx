import React from "react";
import { Package as PackageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import * as fx from "@/data/fixtures";
import { listPackages, type PackageListRow, type PackageSort } from "@/data/repository";
import { getFactory } from "@/data/selectors";
import { useListQuery } from "@/hooks/useListQuery";

const STATUS_OPTIONS = [
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "shipped", label: "Shipped" },
];

const CUSTOMER_OPTIONS = fx.customers.map((c) => ({ value: c.customerId, label: c.name }));

function summarizeNames(names: string[], emptyLabel: string): string {
  if (names.length === 0) return emptyLabel;
  if (names.length <= 2) return names.join(" & ");
  return `${names[0]} & ${names.length - 1} more`;
}

export function PackagesListPage() {
  const navigate = useNavigate();
  const list = useListQuery<PackageListRow, PackageSort>({
    key: "packages",
    fetcher: listPackages,
    defaultSort: "packageNo",
  });

  const columns: DataTableColumn<PackageListRow>[] = [
    {
      id: "customers",
      header: "For",
      cell: (r) => (
        <div>
          <p className="font-medium text-neutral-800">
            {summarizeNames(
              r.customers.map((c) => c.name),
              "No items packed yet",
            )}
          </p>
          <p className="text-xs text-neutral-400">{r.pkg.packageNo}</p>
        </div>
      ),
    },
    {
      id: "purchases",
      header: "From Factory",
      cell: (r) =>
        r.purchases.length === 0 ? (
          <span className="text-neutral-400">—</span>
        ) : (
          <span className="text-neutral-600">
            {summarizeNames(
              r.purchases.map((p) => getFactory(p.factoryId)?.name ?? p.purchaseNo),
              "",
            )}
          </span>
        ),
    },
    { id: "products", header: "Products", cell: (r) => `${r.productCount} products` },
    { id: "quantity", header: "Quantity", align: "right", cell: (r) => r.totalQuantity },
    { id: "status", header: "Status", sortable: true, cell: (r) => <StatusBadge status={r.pkg.status} /> },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Packages</h1>
        <p className="text-sm text-neutral-500">Purchased stock grouped into packages ready to ship.</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search packages..." className="w-72" />
        <FilterBar>
          <FilterSelect
            label="Customer"
            value={list.filters.customerId}
            options={CUSTOMER_OPTIONS}
            onChange={(v) => list.setFilter("customerId", v)}
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
        rowKey={(r) => r.pkg.packageId}
        loading={list.isLoading}
        sort={list.sort}
        sortDir={list.sortDir}
        onSortChange={list.onSortChange}
        onRowClick={(r) => navigate(`/packages/${r.pkg.packageId}`)}
        emptyState={
          <EmptyState
            icon={PackageIcon}
            title="No packages yet"
            description="Packages are created from purchased items once they're ready to ship."
          />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
