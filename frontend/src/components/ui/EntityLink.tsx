import React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/cn";

interface EntityLinkProps {
  to: string;
  label: string;
  sublabel?: string;
  className?: string;
}

export function EntityLink({ to, label, sublabel, className }: EntityLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-baseline gap-1.5 text-sm font-medium text-neutral-800 hover:text-primary-700",
        className,
      )}
    >
      <span className="underline decoration-neutral-300 decoration-1 underline-offset-2 group-hover:decoration-primary-400">
        {label}
      </span>
      {sublabel && <span className="text-xs font-normal text-neutral-400">{sublabel}</span>}
    </Link>
  );
}
