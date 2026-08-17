import React from "react";
import { Ship } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listShipments, type ShipmentListRow, type ShipmentSort } from "@/data/repository";
import { useListQuery } from "@/hooks/useListQuery";
import { formatDate } from "@/lib/format";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In Transit" },
  { value: "delayed", label: "Delayed" },
  { value: "arrived", label: "Arrived" },
];

export function ShipmentsListPage() {
  const navigate = useNavigate();
  const list = useListQuery<ShipmentListRow, ShipmentSort>({
    key: "shipments",
    fetcher: listShipments,
    defaultSort: "shipmentDate",
  });

  const columns: DataTableColumn<ShipmentListRow>[] = [
    {
      id: "shipmentNo",
      header: "Shipment",
      sortable: true,
      cell: (r) => <span className="font-medium text-neutral-800">{r.shipment.shipmentNo}</span>,
    },
    {
      id: "route",
      header: "Route",
      cell: (r) => (
        <span className="text-neutral-600">
          {r.shipment.origin} <span className="text-neutral-300">→</span> {r.shipment.destination}
        </span>
      ),
    },
    { id: "packages", header: "Packages", cell: (r) => r.packageCount },
    { id: "status", header: "Status", sortable: true, cell: (r) => <StatusBadge status={r.shipment.status} /> },
    {
      id: "expectedArrival",
      header: "Expected Arrival",
      sortable: true,
      cell: (r) => (r.shipment.expectedArrival ? formatDate(r.shipment.expectedArrival) : "—"),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Shipments</h1>
        <p className="text-sm text-neutral-500">Track every shipment from origin to warehouse.</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search shipments..." className="w-72" />
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
        rowKey={(r) => r.shipment.shipmentId}
        loading={list.isLoading}
        sort={list.sort}
        sortDir={list.sortDir}
        onSortChange={list.onSortChange}
        onRowClick={(r) => navigate(`/shipments/${r.shipment.shipmentId}`)}
        emptyState={
          <EmptyState
            icon={Ship}
            title="No shipments yet"
            description="Shipments will appear here when packages are assigned to a shipment."
          />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
