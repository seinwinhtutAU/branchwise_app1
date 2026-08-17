import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/cn";
import type { PurchaseChain } from "@/data/selectors";
import type { Delivery } from "@/data/types";

interface ChainLinkProps {
  label: string;
  to?: string;
  pending?: boolean;
}

function ChainLink({ label, to, pending }: ChainLinkProps) {
  const classes = cn(
    "flex-shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium",
    pending
      ? "border-dashed border-neutral-200 text-neutral-400"
      : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:text-primary-700",
  );

  if (!to || pending) {
    return <span className={classes}>{label}</span>;
  }

  return (
    <Link to={to} className={classes}>
      {label}
    </Link>
  );
}

function Arrow() {
  return <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-neutral-300" />;
}

export function FulfillmentChainRow({ chain }: { chain: PurchaseChain }) {
  const pkg = chain.packages[0];
  const shipment = chain.shipments[0];
  const receiving = chain.receivings[0];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ChainLink label={`Purchase ${chain.purchase.purchaseNo}`} to={`/purchases/${chain.purchase.purchaseId}`} />
      <Arrow />
      <ChainLink
        label={pkg ? `Package ${pkg.packageNo}` : "Package"}
        to={pkg ? `/packages/${pkg.packageId}` : undefined}
        pending={!pkg}
      />
      <Arrow />
      <ChainLink
        label={shipment ? `Shipment ${shipment.shipmentNo}` : "Shipment"}
        to={shipment ? `/shipments/${shipment.shipmentId}` : undefined}
        pending={!shipment}
      />
      <Arrow />
      <ChainLink
        label={receiving ? `Receiving ${receiving.receivingId}` : "Receiving"}
        to={receiving ? `/receiving/${receiving.receivingId}` : undefined}
        pending={!receiving}
      />
    </div>
  );
}

export function DeliveryChainRow({ delivery }: { delivery: Delivery }) {
  return (
    <div className="flex items-center gap-2">
      <ChainLink label={`Delivery ${delivery.deliveryId}`} to={`/deliveries/${delivery.deliveryId}`} />
    </div>
  );
}
