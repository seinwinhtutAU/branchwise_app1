import React from "react";
import { Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { listProducts } from "@/data/repository";
import { getVariantsForProduct } from "@/data/selectors";
import type { Product } from "@/data/types";
import { useListQuery } from "@/hooks/useListQuery";

export function ProductsListPage() {
  const navigate = useNavigate();
  const list = useListQuery<Product>({ key: "products", fetcher: listProducts });

  const columns: DataTableColumn<Product>[] = [
    {
      id: "name",
      header: "Product",
      cell: (p) => (
        <div>
          <p className="font-medium text-neutral-800">{p.name}</p>
          <p className="text-xs text-neutral-400">{p.productCode}</p>
        </div>
      ),
    },
    {
      id: "variants",
      header: "Variants",
      cell: (p) => {
        const variants = getVariantsForProduct(p.productId);
        if (variants.length === 0) return "—";
        const colors = variants.map((v) => v.color).filter((c): c is string => Boolean(c));
        if (colors.length > 0) return colors.join(", ");
        return variants.length === 1 ? "1 variant" : `${variants.length} variants`;
      },
    },
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
        onRowClick={(p) => navigate(`/products/${p.productId}`)}
        emptyState={<EmptyState icon={Tags} title="No products found" description="Try a different search." />}
      />

      {list.data && (
        <Pagination page={list.page} pageSize={list.pageSize} total={list.data.total} onPageChange={list.setPage} />
      )}
    </div>
  );
}
