import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { IconButton } from "@/components/ui/IconButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, description, children, footer, width = "w-[420px]" }: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-neutral-900/30" onClick={onClose} />
      <div className={`relative ${width} animate-scale-in rounded-lg bg-white shadow-popover`}>
        <div className="flex items-start justify-between border-b border-neutral-150 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-neutral-500">{description}</p>}
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-neutral-150 px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
