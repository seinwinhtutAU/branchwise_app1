export interface Page<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListParams<TSort extends string = string> {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: TSort;
  sortDir?: "asc" | "desc";
  filters?: Record<string, string | undefined>;
}

// Simulates real network latency so loading states are exercised even
// against in-memory fixture data. Swap the repository functions' bodies for
// real `fetch` calls once the FastAPI endpoints exist — callers don't change.
export function networkDelay(ms = 220): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function paginate<T>(rows: T[], page = 1, pageSize = 20): Page<T> {
  const start = (page - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
  };
}

export function matchesSearch(haystacks: Array<string | null | undefined>, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystacks.some((h) => h?.toLowerCase().includes(q));
}

export function sortRows<T>(
  rows: T[],
  sort: string | undefined,
  sortDir: "asc" | "desc" | undefined,
  accessors: Record<string, (row: T) => string | number>,
): T[] {
  if (!sort || !accessors[sort]) return rows;
  const accessor = accessors[sort];
  const dir = sortDir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = accessor(a);
    const bv = accessor(b);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}
