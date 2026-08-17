import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";

import { searchAll } from "@/data/search";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = searchAll(query);
  const grouped = results.reduce<Record<string, typeof results>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  function go(path: string) {
    navigate(path);
    onClose();
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      label="Global search"
      className="fixed left-1/2 top-24 z-[100] w-full max-w-lg -translate-x-1/2 animate-scale-in overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-popover"
    >
      <Command.Input
        value={query}
        onValueChange={setQuery}
        placeholder="Search orders, customers, products, shipments..."
        className="w-full border-b border-neutral-150 px-4 py-3 text-sm outline-none placeholder:text-neutral-400"
      />
      <Command.List className="max-h-80 overflow-y-auto p-1.5">
        <Command.Empty className="px-3 py-8 text-center text-sm text-neutral-400">
          No results found.
        </Command.Empty>

        {Object.entries(grouped).map(([group, items]) => (
          <Command.Group
            key={group}
            heading={group}
            className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 [&_[cmdk-group-items]]:mt-1"
          >
            {items.map((item) => (
              <Command.Item
                key={`${item.group}-${item.id}`}
                value={`${item.label} ${item.sublabel}`}
                onSelect={() => go(item.path)}
                className="flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-sm text-neutral-700 aria-selected:bg-primary-50 aria-selected:text-primary-700"
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-neutral-400">{item.sublabel}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
