import React from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import * as fx from "@/data/fixtures";
import { listOrders, type OrderListRow, type OrderSort } from "@/data/repository";
import { getOrderItemsWithFulfillment } from "@/data/selectors";
import { useListQuery } from "@/hooks/useListQuery";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "partially_fulfilled", label: "Partially Fulfilled" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

const CUSTOMER_OPTIONS = fx.customers.map((c) => ({ value: c.customerId, label: c.name }));

export function OrdersListPage() {
  const navigate = useNavigate();
  const list = useListQuery<OrderListRow, OrderSort>({
    key: "orders",
    fetcher: listOrders,
    defaultSort: "orderDate",
  });

  const columns: DataTableColumn<OrderListRow>[] = [
    {
      id: "orderNo",
      header: "Order",
      sortable: true,
      cell: (r) => <span className="font-medium text-neutral-800">{r.order.orderNo}</span>,
    },
    { id: "customer", header: "Customer", cell: (r) => r.customer.name },
    { id: "products", header: "Products", cell: (r) => `${r.productCount} products` },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge status={r.order.status} />
          {r.attention && r.order.status !== "partially_fulfilled" && (
            <span className="text-xs text-neutral-400">· {r.attention.reason}</span>
          )}
        </div>
      ),
    },
    { id: "orderDate", header: "Date", sortable: true, cell: (r) => formatDate(r.order.orderDate) },
    {
      id: "totalAmount",
      header: "Total",
      sortable: true,
      align: "right",
      cell: (r) => formatCurrency(r.order.totalAmount),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Orders</h1>
          <p className="text-sm text-neutral-500">Track every customer order from placement to delivery.</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search orders..." className="w-72" />
        <FilterBar>
          <FilterSelect
            label="Status"
            value={list.filters.status}
            options={STATUS_OPTIONS}
            onChange={(v) => list.setFilter("status", v)}
          />
          <FilterSelect
            label="Customer"
            value={list.filters.customerId}
            options={CUSTOMER_OPTIONS}
            onChange={(v) => list.setFilter("customerId", v)}
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={list.data?.rows ?? []}
        rowKey={(r) => r.order.orderId}
        loading={list.isLoading}
        sort={list.sort}
        sortDir={list.sortDir}
        onSortChange={list.onSortChange}
        onRowClick={(r) => navigate(`/orders/${r.order.orderId}`)}
        expandedContent={(r) => <OrderItemsPreview orderId={r.order.orderId} />}
        emptyState={
          <EmptyState
            icon={ShoppingCart}
            title="No orders found"
            description="Try adjusting your search or filters."
          />
        }
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}

function OrderItemsPreview({ orderId }: { orderId: string }) {
  const rows = getOrderItemsWithFulfillment(orderId);
  return (
    <table className="w-full max-w-2xl text-xs">
      <thead>
        <tr className="text-neutral-400">
          <th className="pb-1.5 text-left font-medium">Product</th>
          <th className="pb-1.5 text-right font-medium">Ordered</th>
          <th className="pb-1.5 text-right font-medium">Purchased</th>
          <th className="pb-1.5 text-right font-medium">Delivered</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.item.orderItemId} className="border-t border-neutral-150">
            <td className="py-1.5 font-medium text-neutral-700">{row.product.name}</td>
            <td className="py-1.5 text-right text-neutral-600">{row.ordered}</td>
            <td className="py-1.5 text-right text-neutral-600">{row.purchased}</td>
            <td className="py-1.5 text-right text-neutral-600">{row.delivered}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
