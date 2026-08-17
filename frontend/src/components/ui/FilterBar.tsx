import React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

export function FilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string | undefined;
  options: FilterOption[];
  onChange: (value: string | undefined) => void;
}

export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const active = value !== undefined && value !== "";
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={cn(
          "h-9 appearance-none rounded-md border bg-white pl-3 pr-7 text-sm font-medium focus:border-primary-400",
          active ? "border-primary-300 text-primary-700 bg-primary-50" : "border-neutral-200 text-neutral-600",
        )}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
    </div>
  );
}
