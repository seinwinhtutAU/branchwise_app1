import React from "react";
import { Tags } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { listProducts } from "@/data/repository";
import type { Product } from "@/data/types";
import { useListQuery } from "@/hooks/useListQuery";

export function ProductsListPage() {
  const list = useListQuery<Product>({ key: "products", fetcher: listProducts });

  const columns: DataTableColumn<Product>[] = [
    { id: "code", header: "Code", cell: (p) => <span className="font-mono text-xs text-neutral-500">{p.productCode}</span> },
    { id: "name", header: "Product", cell: (p) => <span className="font-medium text-neutral-800">{p.name}</span> },
    { id: "color", header: "Color", cell: (p) => p.color ?? "—" },
    { id: "size", header: "Size", cell: (p) => p.size ?? "—" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Products</h1>
        <p className="text-sm text-neutral-500">Catalog of products bought, stocked, and sold.</p>
      </div>

      <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search products..." className="mb-3 w-72" />

      <DataTable
        columns={columns}
        data={list.data?.rows ?? []}
        rowKey={(p) => p.productId}
        loading={list.isLoading}
        emptyState={<EmptyState icon={Tags} title="No products found" description="Try a different search." />}
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
