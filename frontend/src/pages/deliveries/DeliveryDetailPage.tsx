import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { DetailHeader } from "@/components/ui/DetailHeader";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDeliveryDetail } from "@/data/repository";
import { formatDateLong } from "@/lib/format";

export function DeliveryDetailPage() {
  const { deliveryId = "" } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["delivery", deliveryId],
    queryFn: () => getDeliveryDetail(deliveryId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-3xl" />;
  if (isError || !data) return <ErrorState title="Unable to load delivery" onRetry={refetch} />;

  const { delivery, order, customer, items } = data;

  return (
    <div className="max-w-3xl">
      <DetailHeader
        backTo="/deliveries"
        backLabel="Deliveries"
        title={delivery.deliveryId}
        subtitle={customer.name}
        status={<StatusBadge status={delivery.status} />}
        meta={<span className="text-xs text-neutral-500">Delivered {formatDateLong(delivery.deliveryDate)}</span>}
        actions={<EntityLink to={`/orders/${order.orderId}`} label={order.orderNo} sublabel="View order" />}
      />

      <Section title="Items" noPadding>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-150 text-xs text-neutral-400">
              <th className="px-4 py-2 text-left font-medium">Product</th>
              <th className="px-4 py-2 text-right font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ item, product }) => (
              <tr key={item.deliveryItemId} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2.5 font-medium text-neutral-800">{product.name}</td>
                <td className="px-4 py-2.5 text-right text-neutral-700">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
