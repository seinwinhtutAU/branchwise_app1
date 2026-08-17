import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/cn";

export interface EntityOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface EntitySelectorProps {
  options: EntityOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function EntitySelector({ options, value, onChange, placeholder = "Select...", disabled }: EntitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 text-sm disabled:opacity-50",
          open && "border-primary-400",
        )}
      >
        <span className={selected ? "text-neutral-800" : "text-neutral-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-popover">
          <div className="relative border-b border-neutral-100 p-1.5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-7 w-full rounded border border-transparent bg-neutral-50 pl-7 pr-2 text-sm focus:border-primary-300 focus:bg-white"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && <p className="px-3 py-2 text-xs text-neutral-400">No results</p>}
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-neutral-50"
              >
                <span>
                  {opt.label}
                  {opt.sublabel && <span className="ml-1.5 text-xs text-neutral-400">{opt.sublabel}</span>}
                </span>
                {opt.value === value && <Check className="h-3.5 w-3.5 text-primary-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
