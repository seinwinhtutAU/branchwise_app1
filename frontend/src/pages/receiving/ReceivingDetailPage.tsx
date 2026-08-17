import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { DetailHeader } from "@/components/ui/DetailHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getReceivingDetail } from "@/data/repository";
import { formatDateLong } from "@/lib/format";

export function ReceivingDetailPage() {
  const { receivingId = "" } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["receiving", receivingId],
    queryFn: () => getReceivingDetail(receivingId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-3xl" />;
  if (isError || !data) return <ErrorState title="Unable to load receiving record" onRetry={refetch} />;

  const { receiving, shipment, warehouse, items } = data;

  return (
    <div className="max-w-3xl">
      <DetailHeader
        backTo="/receiving"
        backLabel="Receiving"
        title={receiving.receivingId}
        subtitle={`${warehouse.name} · from ${shipment.shipmentNo}`}
        status={<StatusBadge status={receiving.status} />}
        meta={<span className="text-xs text-neutral-500">Received {formatDateLong(receiving.receivedDate)}</span>}
      />

      <Section title="Items" noPadding>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-150 text-xs text-neutral-400">
              <th className="px-4 py-2 text-left font-medium">Product</th>
              <th className="px-4 py-2 text-right font-medium">Expected</th>
              <th className="px-4 py-2 text-right font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ item, product }) => {
              const short = item.quantityReceived < item.quantityExpected;
              return (
                <tr key={item.receivingItemId} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-neutral-800">{product.name}</td>
                  <td className="px-4 py-2.5 text-right text-neutral-500">{item.quantityExpected}</td>
                  <td className={`px-4 py-2.5 text-right font-medium ${short ? "text-warning-600" : "text-success-700"}`}>
                    {item.quantityReceived}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
