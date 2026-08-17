import React, { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, ChevronsUpDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/cn";
import { SkeletonTable } from "@/components/ui/Skeleton";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  sort?: string;
  sortDir?: "asc" | "desc";
  onSortChange?: (sort: string) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  expandedContent?: (row: T) => React.ReactNode;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  sort,
  sortDir,
  onSortChange,
  loading,
  emptyState,
  expandedContent,
  selectable,
  selectedKeys,
  onSelectionChange,
}: DataTableProps<T>) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpanded(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSelectAll() {
    if (!onSelectionChange) return;
    if (selectedKeys && selectedKeys.size === data.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map(rowKey)));
    }
  }

  function toggleSelectRow(key: string) {
    if (!onSelectionChange) return;
    const next = new Set(selectedKeys ?? []);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange(next);
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <SkeletonTable columns={columns.length} />
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="rounded-lg border border-neutral-200 bg-white">{emptyState}</div>;
  }

  const allSelected = selectable && selectedKeys && data.length > 0 && selectedKeys.size === data.length;

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-25">
              {expandedContent && <th className="w-8 px-2 py-2" />}
              {selectable && (
                <th className="w-8 px-2 py-2">
                  <input
                    type="checkbox"
                    checked={!!allSelected}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-neutral-300 text-primary-600"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "select-none whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-neutral-500",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.width,
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSortChange?.(col.id)}
                      className="inline-flex items-center gap-1 hover:text-neutral-800"
                    >
                      {col.header}
                      {sort === col.id ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 text-neutral-300" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const key = rowKey(row);
              const isExpanded = expanded.has(key);
              return (
                <Fragment key={key}>
                  <tr
                    className={cn(
                      "border-b border-neutral-100 last:border-0",
                      onRowClick && "cursor-pointer hover:bg-neutral-50",
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {expandedContent && (
                      <td className="px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleExpanded(key)}
                          className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                    )}
                    {selectable && (
                      <td className="px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedKeys?.has(key) ?? false}
                          onChange={() => toggleSelectRow(key)}
                          className="h-3.5 w-3.5 rounded border-neutral-300 text-primary-600"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cn(
                          "px-3 py-2.5 text-neutral-700",
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                  {expandedContent && isExpanded && (
                    <tr className="border-b border-neutral-100 bg-neutral-25 last:border-0">
                      <td colSpan={columns.length + (selectable ? 2 : 1)} className="px-4 py-3">
                        {expandedContent(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
