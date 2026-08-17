import React from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { listCustomers } from "@/data/repository";
import type { Customer } from "@/data/types";
import { useListQuery } from "@/hooks/useListQuery";

export function CustomersListPage() {
  const navigate = useNavigate();
  const list = useListQuery<Customer>({ key: "customers", fetcher: listCustomers });

  const columns: DataTableColumn<Customer>[] = [
    { id: "name", header: "Customer", cell: (c) => <span className="font-medium text-neutral-800">{c.name}</span> },
    { id: "phone", header: "Phone", cell: (c) => c.phone ?? "—" },
    { id: "address", header: "Address", cell: (c) => c.address ?? "—" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Customers</h1>
        <p className="text-sm text-neutral-500">Wholesale customers placing orders.</p>
      </div>

      <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search customers..." className="mb-3 w-72" />

      <DataTable
        columns={columns}
        data={list.data?.rows ?? []}
        rowKey={(c) => c.customerId}
        loading={list.isLoading}
        onRowClick={(c) => navigate(`/customers/${c.customerId}`)}
        emptyState={<EmptyState icon={Users} title="No customers found" description="Try a different search." />}
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
