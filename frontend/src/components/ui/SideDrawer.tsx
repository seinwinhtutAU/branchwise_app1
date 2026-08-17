import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { IconButton } from "@/components/ui/IconButton";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export function SideDrawer({ open, onClose, title, description, children, footer, width = "w-[480px]" }: SideDrawerProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-neutral-900/30" onClick={onClose} />
      <div
        className={`relative flex h-full ${width} flex-col bg-white shadow-popover animate-slide-in-right`}
      >
        <div className="flex items-start justify-between border-b border-neutral-150 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-neutral-500">{description}</p>}
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-neutral-150 px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
