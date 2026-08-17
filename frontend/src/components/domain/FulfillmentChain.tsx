import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/cn";
import { getFactory, getPackageItemDetails, getWarehouse } from "@/data/selectors";
import type { PurchaseChain } from "@/data/selectors";
import type { Delivery } from "@/data/types";

interface ChainLinkProps {
  label: string;
  sublabel?: string;
  to?: string;
  pending?: boolean;
}

function ChainLink({ label, sublabel, to, pending }: ChainLinkProps) {
  const classes = cn(
    "flex-shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium leading-tight",
    pending
      ? "border-dashed border-neutral-200 text-neutral-400"
      : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:text-primary-700",
  );

  const content = (
    <>
      {label}
      {sublabel && <span className="ml-1 font-normal text-neutral-400">{sublabel}</span>}
    </>
  );

  if (!to || pending) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link to={to} className={classes}>
      {content}
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

  const factory = getFactory(chain.purchase.factoryId);
  const packageCustomers = pkg ? Array.from(new Set(getPackageItemDetails(pkg.packageId).map((d) => d.customer.name))) : [];
  const receivingWarehouse = receiving ? getWarehouse(receiving.warehouseId) : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ChainLink
        label={factory?.name ?? "Factory"}
        sublabel={chain.purchase.purchaseNo}
        to={`/purchases/${chain.purchase.purchaseId}`}
      />
      <Arrow />
      <ChainLink
        label={packageCustomers.length > 0 ? packageCustomers.join(", ") : pkg ? pkg.packageNo : "Package"}
        sublabel={pkg && packageCustomers.length > 0 ? pkg.packageNo : undefined}
        to={pkg ? `/packages/${pkg.packageId}` : undefined}
        pending={!pkg}
      />
      <Arrow />
      <ChainLink
        label={shipment ? `${shipment.origin} → ${shipment.destination}` : "Shipment"}
        sublabel={shipment?.shipmentNo}
        to={shipment ? `/shipments/${shipment.shipmentId}` : undefined}
        pending={!shipment}
      />
      <Arrow />
      <ChainLink
        label={receivingWarehouse?.name ?? (receiving ? receiving.receivingId : "Receiving")}
        sublabel={receiving && receivingWarehouse ? receiving.receivingId : undefined}
        to={receiving ? `/receiving/${receiving.receivingId}` : undefined}
        pending={!receiving}
      />
    </div>
  );
}

export function DeliveryChainRow({ delivery }: { delivery: Delivery }) {
  return (
    <div className="flex items-center gap-2">
      <ChainLink label="Delivered" sublabel={delivery.deliveryId} to={`/deliveries/${delivery.deliveryId}`} />
    </div>
  );
}
