import React from "react";
import { Factory as FactoryIcon } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { listFactories } from "@/data/repository";
import type { Factory } from "@/data/types";
import { useListQuery } from "@/hooks/useListQuery";

export function FactoriesListPage() {
  const list = useListQuery<Factory>({ key: "factories", fetcher: listFactories });

  const columns: DataTableColumn<Factory>[] = [
    { id: "name", header: "Factory", cell: (f) => <span className="font-medium text-neutral-800">{f.name}</span> },
    { id: "phone", header: "Phone", cell: (f) => f.phone ?? "—" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Factories</h1>
        <p className="text-sm text-neutral-500">Manufacturing partners you purchase stock from.</p>
      </div>

      <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search factories..." className="mb-3 w-72" />

      <DataTable
        columns={columns}
        data={list.data?.rows ?? []}
        rowKey={(f) => f.factoryId}
        loading={list.isLoading}
        emptyState={<EmptyState icon={FactoryIcon} title="No factories found" description="Try a different search." />}
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
