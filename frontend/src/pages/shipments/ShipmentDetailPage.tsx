import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { DetailHeader } from "@/components/ui/DetailHeader";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RouteTimeline } from "@/components/ui/Timeline";
import { getShipmentDetail } from "@/data/repository";
import { getPackageItemDetails } from "@/data/selectors";
import { formatDateLong } from "@/lib/format";

export function ShipmentDetailPage() {
  const { shipmentId = "" } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => getShipmentDetail(shipmentId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-3xl" />;
  if (isError || !data) return <ErrorState title="Unable to load shipment" onRetry={refetch} />;

  const { shipment, packages, legs, receiving } = data;

  return (
    <div className="max-w-3xl">
      <DetailHeader
        backTo="/shipments"
        backLabel="Shipments"
        title={shipment.shipmentNo}
        subtitle={`${shipment.origin} → ${shipment.destination}`}
        status={<StatusBadge status={shipment.status} />}
        meta={
          shipment.expectedArrival && (
            <span className="text-xs text-neutral-500">
              Expected arrival: <span className="font-medium text-neutral-700">{formatDateLong(shipment.expectedArrival)}</span>
            </span>
          )
        }
      />

      <Section title="Packages in this Shipment" className="mb-4">
        {packages.length === 0 ? (
          <p className="text-sm text-neutral-400">No packages assigned yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {packages.map((pkg) => {
              const purchaseNos = Array.from(
                new Set(getPackageItemDetails(pkg.packageId).map((d) => d.purchase.purchaseNo)),
              );
              return (
                <div key={pkg.packageId} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <EntityLink
                    to={`/packages/${pkg.packageId}`}
                    label={pkg.packageNo}
                    sublabel={purchaseNos.length > 0 ? `from ${purchaseNos.join(", ")}` : undefined}
                  />
                  <StatusBadge status={pkg.status} />
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Transportation Timeline" description="Full journey from origin to destination">
        <RouteTimeline
          legs={legs}
          finalLabel={receiving ? `Received at ${shipment.destination}` : "Arrived"}
          finalReached={shipment.status === "arrived"}
        />
      </Section>

      {receiving && (
        <Section title="Receiving" className="mt-4">
          <div className="flex items-center justify-between">
            <EntityLink to={`/receiving/${receiving.receivingId}`} label={receiving.receivingId} sublabel={formatDateLong(receiving.receivedDate)} />
            <StatusBadge status={receiving.status} />
          </div>
        </Section>
      )}
    </div>
  );
}
