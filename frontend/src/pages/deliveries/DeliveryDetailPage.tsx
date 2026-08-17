import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { markDelivered } from "@/data/mutations";
import { getDeliveryDetail } from "@/data/repository";
import { formatDateLong } from "@/lib/format";

export function DeliveryDetailPage() {
  const { deliveryId = "" } = useParams();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["delivery", deliveryId],
    queryFn: () => getDeliveryDetail(deliveryId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-3xl" />;
  if (isError || !data) return <ErrorState title="Unable to load delivery" onRetry={refetch} />;

  const { delivery, order, customer, items } = data;
  const isDelivered = delivery.status === "delivered";

  async function handleMarkDelivered() {
    setConfirming(true);
    markDelivered(deliveryId);
    await new Promise((r) => setTimeout(r, 300));
    setConfirming(false);
    toast.show("Delivery confirmed", "success");
    refetch();
  }

  return (
    <div className="max-w-3xl">
      <DetailHeader
        backTo="/deliveries"
        backLabel="Deliveries"
        title={customer.name}
        code={delivery.deliveryId}
        status={<StatusBadge status={delivery.status} />}
        meta={
          <span className="text-xs text-neutral-500">
            {isDelivered
              ? `Delivered ${formatDateLong(delivery.deliveryDate!)}`
              : delivery.expectedDeliveryDate
                ? `Expected ${formatDateLong(delivery.expectedDeliveryDate)}`
                : "No date scheduled"}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <EntityLink to={`/orders/${order.orderId}`} label={order.orderNo} sublabel="View order" />
            {!isDelivered && delivery.status !== "cancelled" && (
              <Button variant="primary" loading={confirming} onClick={handleMarkDelivered}>
                Mark as Delivered
              </Button>
            )}
          </div>
        }
      />

      <Section title="Items" noPadding>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-150 text-xs text-neutral-400">
              <th className="px-4 py-2 text-left font-medium">Product</th>
              <th className="px-4 py-2 text-left font-medium">Source</th>
              <th className="px-4 py-2 text-right font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ item, product, variant, source }) => (
              <tr key={item.deliveryItemId} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-neutral-800">{product.name}</p>
                  {variant.color && <p className="text-xs text-neutral-400">{variant.color}</p>}
                </td>
                <td className="px-4 py-2.5 text-neutral-500">
                  {source.kind === "warehouse"
                    ? `From ${source.warehouse?.name ?? "warehouse stock"}`
                    : source.kind === "direct"
                      ? `Direct from ${source.factory?.name ?? "factory"}`
                      : "—"}
                </td>
                <td className="px-4 py-2.5 text-right text-neutral-700">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
