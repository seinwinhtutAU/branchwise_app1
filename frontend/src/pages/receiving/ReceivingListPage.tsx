import React from "react";
import { Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { EntityLink } from "@/components/ui/EntityLink";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listReceivings, type ReceivingListRow, type ReceivingSort } from "@/data/repository";
import { useListQuery } from "@/hooks/useListQuery";
import { formatDate } from "@/lib/format";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function ReceivingListPage() {
  const navigate = useNavigate();
  const list = useListQuery<ReceivingListRow, ReceivingSort>({
    key: "receiving",
    fetcher: listReceivings,
    defaultSort: "receivedDate",
  });

  const columns: DataTableColumn<ReceivingListRow>[] = [
    {
      id: "warehouse",
      header: "Warehouse",
      cell: (r) => (
        <div>
          <p className="font-medium text-neutral-800">{r.warehouse.name}</p>
          <p className="text-xs text-neutral-400">{r.receiving.receivingId}</p>
        </div>
      ),
    },
    {
      id: "shipment",
      header: "From Shipment",
      cell: (r) => (
        <EntityLink
          to={`/shipments/${r.shipment.shipmentId}`}
          label={`${r.shipment.origin} → ${r.shipment.destination}`}
          sublabel={r.shipment.shipmentNo}
        />
      ),
    },
    { id: "products", header: "Products", cell: (r) => `${r.productCount} products` },
    { id: "status", header: "Status", sortable: true, cell: (r) => <StatusBadge status={r.receiving.status} /> },
    { id: "receivedDate", header: "Received", sortable: true, cell: (r) => formatDate(r.receiving.receivedDate) },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Receiving</h1>
        <p className="text-sm text-neutral-500">Goods received into warehouses from incoming shipments.</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search receiving..." className="w-72" />
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
        rowKey={(r) => r.receiving.receivingId}
        loading={list.isLoading}
        sort={list.sort}
        sortDir={list.sortDir}
        onSortChange={list.onSortChange}
        onRowClick={(r) => navigate(`/receiving/${r.receiving.receivingId}`)}
        emptyState={
          <EmptyState
            icon={Boxes}
            title="Nothing received yet"
            description="Receiving records appear here once a shipment arrives at a warehouse."
          />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
