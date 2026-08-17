import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { ListParams, Page } from "@/data/queryHelpers";

interface UseListQueryOptions<TRow, TSort extends string> {
  key: string;
  fetcher: (params: ListParams<TSort>) => Promise<Page<TRow>>;
  pageSize?: number;
  defaultSort?: TSort;
}

export function useListQuery<TRow, TSort extends string = string>({
  key,
  fetcher,
  pageSize = 20,
  defaultSort,
}: UseListQueryOptions<TRow, TSort>) {
  const [search, setSearch] = useState("");
  const [filters, setFiltersState] = useState<Record<string, string | undefined>>({});
  const [sort, setSort] = useState<TSort | undefined>(defaultSort);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const params: ListParams<TSort> = { search, filters, sort, sortDir, page, pageSize };

  const query = useQuery({
    queryKey: [key, params],
    queryFn: () => fetcher(params),
  });

  function handleSortChange(nextSort: string) {
    if (sort === nextSort) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(nextSort as TSort);
      setSortDir("asc");
    }
    setPage(1);
  }

  function setFilter(key: string, value: string | undefined) {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    search,
    setSearch: handleSearchChange,
    filters,
    setFilter,
    sort,
    sortDir,
    onSortChange: handleSortChange,
    page,
    setPage,
    pageSize,
  };
}
