import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Clock, PackageSearch, ShoppingCart, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDashboardData } from "@/data/repository";
import { useAuth } from "@/hooks/useAuth";
import { formatDateLong } from "@/lib/format";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const STAT_CONFIG = [
  { key: "openOrders", label: "Open Orders", icon: ShoppingCart },
  { key: "toPurchase", label: "To Purchase", icon: PackageSearch },
  { key: "inTransit", label: "In Transit", icon: Truck },
  { key: "toReceive", label: "To Receive", icon: Clock },
] as const;

const severityDot: Record<string, string> = {
  info: "bg-info-600",
  warning: "bg-warning-600",
  danger: "bg-danger-600",
};

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboardData });

  const firstName = user?.email?.split("@")[0];

  return (
    <div className="max-w-6xl">
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
        {greeting()}
        {firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">Here&apos;s what&apos;s happening across operations today.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="mt-3 h-7 w-12" />
              </div>
            ))
          : STAT_CONFIG.map((stat) => (
              <div key={stat.key} className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <stat.icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">{data.stats[stat.key]}</p>
              </div>
            ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Section title="Orders Requiring Attention" description="Sorted by what needs action first">
          {isLoading || !data ? (
            <SkeletonBlock />
          ) : data.attention.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Nothing needs attention"
              description="Every open order is progressing normally."
            />
          ) : (
            <div className="-mx-4 -my-4 divide-y divide-neutral-100">
              {data.attention.map(({ order, customer, attention }) => (
                <Link
                  key={order.orderId}
                  to={`/orders/${order.orderId}`}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${severityDot[attention.severity]}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{order.orderNo}</p>
                      <p className="text-xs text-neutral-500">{customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">{attention.reason}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Section>

        <Section title="Shipment Activity" description="Currently moving or delayed">
          {isLoading || !data ? (
            <SkeletonBlock />
          ) : data.shipmentActivity.length === 0 ? (
            <EmptyState
              icon={Truck}
              title="No active shipments"
              description="Shipments will appear here once packages are on the move."
            />
          ) : (
            <div className="-mx-4 -my-4 divide-y divide-neutral-100">
              {data.shipmentActivity.map(({ shipment, legs }) => {
                const currentLeg = legs.find((l) => l.status === "in_transit" || l.status === "delayed");
                return (
                  <Link
                    key={shipment.shipmentId}
                    to={`/shipments/${shipment.shipmentId}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-neutral-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{shipment.shipmentNo}</p>
                      <p className="text-xs text-neutral-500">
                        {shipment.origin} → {shipment.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      {shipment.status === "delayed" && currentLeg?.departureDate && (
                        <span className="flex items-center gap-1 text-xs text-danger-600">
                          <AlertTriangle className="h-3 w-3" />
                          since {formatDateLong(currentLeg.departureDate)}
                        </span>
                      )}
                      <StatusBadge status={shipment.status} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
