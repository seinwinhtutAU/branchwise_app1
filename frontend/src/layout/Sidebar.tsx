import React from "react";
import { NavLink } from "react-router-dom";
import { Boxes, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { navGroups } from "@/layout/navConfig";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const content = (
    <div className="flex h-full w-56 flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-14 items-center justify-between border-b border-neutral-150 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-600 text-white">
            <Boxes className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-neutral-800">Branchwise</span>
        </div>
        <button
          onClick={onMobileClose}
          className="rounded p-1 text-neutral-400 hover:bg-neutral-100 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800",
                    )
                  }
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{content}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-neutral-900/30" onClick={onMobileClose} />
          <div className="relative animate-slide-in-right">{content}</div>
        </div>
      )}
    </>
  );
}
