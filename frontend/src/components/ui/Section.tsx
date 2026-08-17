import React from "react";

import { cn } from "@/lib/cn";

interface SectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function Section({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
  noPadding,
}: SectionProps) {
  return (
    <section className={cn("rounded-lg border border-neutral-200 bg-white shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-neutral-150 px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-neutral-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(noPadding ? "" : "p-4", bodyClassName)}>{children}</div>
    </section>
  );
}
