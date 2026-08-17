import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { useParams } from "react-router-dom";

import { DetailHeader } from "@/components/ui/DetailHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProductDetail } from "@/data/repository";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

export function ProductDetailPage() {
  const { productId = "" } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetail(productId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-4xl" />;
  if (isError || !data) return <ErrorState title="Unable to load product" onRetry={refetch} />;

  const { product, variants, factories, orders, inventory, inTransitShipments } = data;

  return (
    <div className="max-w-4xl">
      <DetailHeader backTo="/products" backLabel="Products" title={product.name} code={product.productCode} />

      <Section title="Variants" description="Color/group combinations sold under this product code" className="mb-4">
        {variants.length === 0 ? (
          <p className="text-sm text-neutral-400">No variants yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <span
                key={v.variantId}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700"
              >
                {[v.color, v.groupName].filter(Boolean).join(" · ") || "Unspecified"}
              </span>
            ))}
          </div>
        )}
      </Section>

      <div className="grid grid-cols-2 gap-4">
        <Section title="Supplied By" description="Factories we buy this product from">
          {factories.length === 0 ? (
            <p className="text-sm text-neutral-400">Not purchased from a factory yet.</p>
          ) : (
            <div className="space-y-2">
              {factories.map((row) => (
                <div key={row.factory.factoryId} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-800">{row.factory.name}</span>
                  <span className="text-sm text-neutral-500">{formatNumber(row.totalPurchased)} bought</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Currently In Transit" description="Shipments carrying this product right now">
          {inTransitShipments.length === 0 ? (
            <p className="text-sm text-neutral-400">Nothing in transit.</p>
          ) : (
            <div className="space-y-2">
              {inTransitShipments.map((shipment) => (
                <div key={shipment.shipmentId} className="flex items-center justify-between">
                  <EntityLink
                    to={`/shipments/${shipment.shipmentId}`}
                    label={`${shipment.origin} → ${shipment.destination}`}
                    sublabel={shipment.shipmentNo}
                  />
                  <StatusBadge status={shipment.status} />
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Section title="Inventory" description="Available = On Hand − Reserved" className="my-4" noPadding>
        {inventory.length === 0 ? (
          <p className="px-4 py-3 text-sm text-neutral-400">No stock at any warehouse yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-150 text-xs text-neutral-400">
                <th className="px-4 py-2 text-left font-medium">Warehouse</th>
                <th className="px-4 py-2 text-left font-medium">Variant</th>
                <th className="px-4 py-2 text-right font-medium">On Hand</th>
                <th className="px-4 py-2 text-right font-medium">Reserved</th>
                <th className="px-4 py-2 text-right font-medium">Incoming</th>
                <th className="px-4 py-2 text-right font-medium">Available</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((row) => (
                <tr key={row.inventoryId} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-neutral-800">{row.warehouse.name}</td>
                  <td className="px-4 py-2.5 text-neutral-500">
                    {[row.variant.color, row.variant.groupName].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-neutral-700">{formatNumber(row.quantity)}</td>
                  <td className="px-4 py-2.5 text-right text-neutral-500">{formatNumber(row.reserved)}</td>
                  <td className="px-4 py-2.5 text-right text-neutral-500">
                    {row.incoming > 0 ? `+${formatNumber(row.incoming)}` : "—"}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-right font-semibold",
                      row.lowStock ? "text-danger-600" : "text-neutral-800",
                    )}
                  >
                    {formatNumber(row.available)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Ordered By" description="Customer orders that include this product" noPadding>
        {orders.length === 0 ? (
          <EmptyState icon={Truck} title="No orders yet" description="Orders including this product will show up here." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-150 text-xs text-neutral-400">
                <th className="px-4 py-2 text-left font-medium">Customer</th>
                <th className="px-4 py-2 text-left font-medium">Order</th>
                <th className="px-4 py-2 text-right font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => (
                <tr key={row.order.orderId} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-2.5">
                    <EntityLink
                      to={`/customers/${row.customer.customerId}`}
                      label={row.customer.name}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <EntityLink to={`/orders/${row.order.orderId}`} label={row.order.orderNo} />
                  </td>
                  <td className="px-4 py-2.5 text-right text-neutral-700">{row.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}
