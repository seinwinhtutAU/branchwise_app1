import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatDate(value: string | Date, pattern = "MMM d"): string {
  const date = toDate(value);
  return isValid(date) ? format(date, pattern) : "—";
}

export function formatDateLong(value: string | Date): string {
  return formatDate(value, "MMM d, yyyy");
}

export function formatRelative(value: string | Date): string {
  const date = toDate(value);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : "—";
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
