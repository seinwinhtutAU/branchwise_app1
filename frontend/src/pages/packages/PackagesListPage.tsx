import React from "react";
import { Package as PackageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { EntityLink } from "@/components/ui/EntityLink";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listPackages, type PackageListRow, type PackageSort } from "@/data/repository";
import { useListQuery } from "@/hooks/useListQuery";

const STATUS_OPTIONS = [
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "shipped", label: "Shipped" },
];

export function PackagesListPage() {
  const navigate = useNavigate();
  const list = useListQuery<PackageListRow, PackageSort>({
    key: "packages",
    fetcher: listPackages,
    defaultSort: "packageNo",
  });

  const columns: DataTableColumn<PackageListRow>[] = [
    {
      id: "packageNo",
      header: "Package",
      sortable: true,
      cell: (r) => <span className="font-medium text-neutral-800">{r.pkg.packageNo}</span>,
    },
    {
      id: "purchases",
      header: "From Purchase(s)",
      cell: (r) =>
        r.purchases.length === 0 ? (
          <span className="text-neutral-400">—</span>
        ) : (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {r.purchases.map((p) => (
              <EntityLink key={p.purchaseId} to={`/purchases/${p.purchaseId}`} label={p.purchaseNo} />
            ))}
          </div>
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
