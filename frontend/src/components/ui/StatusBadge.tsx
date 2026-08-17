import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  Clock,
  Loader2,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/cn";

export type KnownStatus =
  | "draft"
  | "pending"
  | "processing"
  | "partially_fulfilled"
  | "fulfilled"
  | "cancelled"
  | "preparing"
  | "ready"
  | "shipped"
  | "in_transit"
  | "delayed"
  | "arrived"
  | "in_progress"
  | "completed"
  | "delivered";

interface StatusConfigEntry {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

const STATUS_CONFIG: Record<KnownStatus, StatusConfigEntry> = {
  draft: { label: "Draft", icon: CircleDashed, className: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  pending: { label: "Pending", icon: Clock, className: "bg-info-50 text-info-700 border-info-200" },
  processing: { label: "Processing", icon: Loader2, className: "bg-info-50 text-info-700 border-info-200" },
  partially_fulfilled: {
    label: "Partially Fulfilled",
    icon: CircleDot,
    className: "bg-warning-50 text-warning-700 border-warning-200",
  },
  fulfilled: { label: "Fulfilled", icon: CheckCircle2, className: "bg-success-50 text-success-700 border-success-200" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-danger-50 text-danger-700 border-danger-200" },
  preparing: { label: "Preparing", icon: Package, className: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  ready: { label: "Ready", icon: PackageCheck, className: "bg-info-50 text-info-700 border-info-200" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-info-50 text-info-700 border-info-200" },
  in_transit: { label: "In Transit", icon: Truck, className: "bg-info-50 text-info-700 border-info-200" },
  delayed: { label: "Delayed", icon: AlertTriangle, className: "bg-danger-50 text-danger-700 border-danger-200" },
  arrived: { label: "Arrived", icon: PackageCheck, className: "bg-success-50 text-success-700 border-success-200" },
  in_progress: { label: "In Progress", icon: Loader2, className: "bg-info-50 text-info-700 border-info-200" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-success-50 text-success-700 border-success-200" },
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-success-50 text-success-700 border-success-200" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as KnownStatus] ?? {
    label: status,
    icon: CircleDot,
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium leading-none",
        config.className,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
