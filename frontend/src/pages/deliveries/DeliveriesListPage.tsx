import React from "react";
import { Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { EntityLink } from "@/components/ui/EntityLink";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listDeliveries, type DeliveryListRow, type DeliverySort } from "@/data/repository";
import { useListQuery } from "@/hooks/useListQuery";
import { formatDate } from "@/lib/format";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function DeliveriesListPage() {
  const navigate = useNavigate();
  const list = useListQuery<DeliveryListRow, DeliverySort>({
    key: "deliveries",
    fetcher: listDeliveries,
    defaultSort: "deliveryDate",
  });

  const columns: DataTableColumn<DeliveryListRow>[] = [
    {
      id: "deliveryId",
      header: "Delivery",
      cell: (r) => <span className="font-medium text-neutral-800">{r.delivery.deliveryId}</span>,
    },
    {
      id: "order",
      header: "Order",
      cell: (r) => <EntityLink to={`/orders/${r.order.orderId}`} label={r.order.orderNo} />,
    },
    { id: "customer", header: "Customer", cell: (r) => r.customer.name },
    { id: "products", header: "Products", cell: (r) => `${r.productCount} products` },
    { id: "status", header: "Status", sortable: true, cell: (r) => <StatusBadge status={r.delivery.status} /> },
    { id: "deliveryDate", header: "Date", sortable: true, cell: (r) => formatDate(r.delivery.deliveryDate) },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Deliveries</h1>
        <p className="text-sm text-neutral-500">Final-mile delivery of orders to customers.</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search deliveries..." className="w-72" />
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
        rowKey={(r) => r.delivery.deliveryId}
        loading={list.isLoading}
        sort={list.sort}
        sortDir={list.sortDir}
        onSortChange={list.onSortChange}
        onRowClick={(r) => navigate(`/deliveries/${r.delivery.deliveryId}`)}
        emptyState={
          <EmptyState
            icon={Truck}
            title="No deliveries yet"
            description="Deliveries appear here once an order is ready to ship to the customer."
          />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
