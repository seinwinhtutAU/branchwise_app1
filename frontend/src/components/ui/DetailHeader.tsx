import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface DetailHeaderProps {
  backTo: string;
  backLabel: string;
  title: string;
  /** The record's internal reference number (SO-/PO-/PK-/SH-...), shown as
   * small secondary text next to the title — never the primary heading.
   * Human context (customer, factory, route, warehouse) belongs in `title`. */
  code?: string;
  subtitle?: string;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export function DetailHeader({
  backTo,
  backLabel,
  title,
  code,
  subtitle,
  status,
  actions,
  meta,
}: DetailHeaderProps) {
  return (
    <div className="mb-5">
      <Link
        to={backTo}
        className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-800"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {backLabel}
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">{title}</h1>
            {code && <span className="text-sm font-normal text-neutral-400">{code}</span>}
            {status}
          </div>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
          {meta && <div className="mt-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
