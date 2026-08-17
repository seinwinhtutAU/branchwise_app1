import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { DetailHeader } from "@/components/ui/DetailHeader";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPackageDetail } from "@/data/repository";

export function PackageDetailPage() {
  const { packageId = "" } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["package", packageId],
    queryFn: () => getPackageDetail(packageId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-3xl" />;
  if (isError || !data) return <ErrorState title="Unable to load package" onRetry={refetch} />;

  const { pkg, purchases, items, shipment } = data;

  return (
    <div className="max-w-3xl">
      <DetailHeader
        backTo="/packages"
        backLabel="Packages"
        title={pkg.packageNo}
        subtitle={
          purchases.length === 0
            ? "No items packed yet"
            : purchases.length === 1
              ? `From purchase ${purchases[0].purchaseNo}`
              : `From ${purchases.length} purchases`
        }
        status={<StatusBadge status={pkg.status} />}
      />

      <Section
        title="Contents"
        description="Each line shows the customer order it's set aside for — packing follows the shipment, not one purchase order"
        className="mb-4"
        noPadding
      >
        {items.length === 0 ? (
          <p className="px-4 py-3 text-sm text-neutral-400">Nothing packed yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-150 text-xs text-neutral-400">
                <th className="px-4 py-2 text-left font-medium">Product</th>
                <th className="px-4 py-2 text-left font-medium">From Purchase</th>
                <th className="px-4 py-2 text-left font-medium">For Order</th>
                <th className="px-4 py-2 text-left font-medium">Customer</th>
                <th className="px-4 py-2 text-right font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.packageItemId} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-neutral-800">{row.product.name}</td>
                  <td className="px-4 py-2.5">
                    <EntityLink to={`/purchases/${row.purchase.purchaseId}`} label={row.purchase.purchaseNo} />
                  </td>
                  <td className="px-4 py-2.5">
                    <EntityLink to={`/orders/${row.order.orderId}`} label={row.order.orderNo} />
                  </td>
                  <td className="px-4 py-2.5 text-neutral-600">{row.customer.name}</td>
                  <td className="px-4 py-2.5 text-right text-neutral-700">{row.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Shipment">
        {shipment ? (
          <div className="flex items-center justify-between">
            <EntityLink
              to={`/shipments/${shipment.shipmentId}`}
              label={shipment.shipmentNo}
              sublabel={`${shipment.origin} → ${shipment.destination}`}
            />
            <StatusBadge status={shipment.status} />
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Not yet assigned to a shipment.</p>
        )}
      </Section>
    </div>
  );
}
