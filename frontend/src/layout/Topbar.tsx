import React from "react";
import { LogOut, Menu, Search } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

interface TopbarProps {
  onMobileMenuClick: () => void;
  onSearchClick: () => void;
}

export function Topbar({ onMobileMenuClick, onSearchClick }: TopbarProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4">
      <button
        onClick={onMobileMenuClick}
        className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={onSearchClick}
        className="flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 text-sm text-neutral-400 hover:border-neutral-300 hover:bg-white"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search orders, shipments, products...</span>
        <kbd className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-3">
        {user?.email && <span className="hidden text-xs text-neutral-500 sm:block">{user.email}</span>}
        <button
          onClick={signOut}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
