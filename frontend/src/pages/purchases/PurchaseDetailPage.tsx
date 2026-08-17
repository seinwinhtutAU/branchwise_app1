import React, { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";

import { DetailHeader } from "@/components/ui/DetailHeader";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPurchaseDetail } from "@/data/repository";
import { getPurchaseItemOrderBreakdown } from "@/data/selectors";
import { formatCurrency, formatDateLong } from "@/lib/format";

export function PurchaseDetailPage() {
  const { purchaseId = "" } = useParams();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["purchase", purchaseId],
    queryFn: () => getPurchaseDetail(purchaseId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-3xl" />;
  if (isError || !data) return <ErrorState title="Unable to load purchase" onRetry={refetch} />;

  const { purchase, factory, items, relatedOrders, packages } = data;

  function toggle(purchaseItemId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(purchaseItemId)) next.delete(purchaseItemId);
      else next.add(purchaseItemId);
      return next;
    });
  }

  return (
    <div className="max-w-3xl">
      <DetailHeader
        backTo="/purchases"
        backLabel="Purchases"
        title={purchase.purchaseNo}
        subtitle={factory.name}
        status={<StatusBadge status={purchase.status} />}
        meta={<span className="text-xs text-neutral-500">Ordered {formatDateLong(purchase.purchaseDate)}</span>}
      />

      <Section
        title="Items"
        description="Expand a product to see which orders it's allocated to"
        className="mb-4"
        noPadding
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-150 text-xs text-neutral-400">
              <th className="w-8 px-2 py-2" />
              <th className="px-2 py-2 text-left font-medium">Product</th>
              <th className="px-4 py-2 text-right font-medium">Quantity</th>
              <th className="px-4 py-2 text-right font-medium">Buying Price</th>
              <th className="px-4 py-2 text-right font-medium">Allocated to Orders</th>
              <th className="px-4 py-2 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ item, product, allocated }) => {
              const breakdown = getPurchaseItemOrderBreakdown(item.purchaseItemId);
              const isExpanded = expanded.has(item.purchaseItemId);
              return (
                <Fragment key={item.purchaseItemId}>
                  <tr className="border-b border-neutral-100 last:border-0">
                    <td className="px-2 py-2.5">
                      {breakdown.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggle(item.purchaseItemId)}
                          className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-2.5 font-medium text-neutral-800">{product.name}</td>
                    <td className="px-4 py-2.5 text-right text-neutral-700">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-right text-neutral-500">{formatCurrency(item.buyingPrice)}</td>
                    <td className="px-4 py-2.5 text-right text-neutral-500">
                      {allocated}
                      {breakdown.length > 1 && (
                        <span className="ml-1 text-xs text-neutral-400">({breakdown.length} orders)</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-neutral-800">
                      {formatCurrency(item.buyingPrice * item.quantity)}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-neutral-100 bg-neutral-25 last:border-0">
                      <td colSpan={6} className="px-4 py-3">
                        <table className="w-full max-w-md text-xs">
                          <thead>
                            <tr className="text-neutral-400">
                              <th className="pb-1.5 text-left font-medium">Order</th>
                              <th className="pb-1.5 text-left font-medium">Customer</th>
                              <th className="pb-1.5 text-right font-medium">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {breakdown.map((row) => (
                              <tr key={row.orderId} className="border-t border-neutral-150">
                                <td className="py-1.5">
                                  <EntityLink to={`/orders/${row.orderId}`} label={row.orderNo} />
                                </td>
                                <td className="py-1.5 text-neutral-600">{row.customerName}</td>
                                <td className="py-1.5 text-right text-neutral-600">{row.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Section>

      <div className="grid grid-cols-2 gap-4">
        <Section title="Related Orders" description="Orders this purchase contributes to">
          {relatedOrders.length === 0 ? (
            <p className="text-sm text-neutral-400">No orders linked.</p>
          ) : (
            <div className="space-y-2">
              {relatedOrders.map((order) => (
                <div key={order.orderId}>
                  <EntityLink to={`/orders/${order.orderId}`} label={order.orderNo} />
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Packages">
          {packages.length === 0 ? (
            <p className="text-sm text-neutral-400">Not packaged yet.</p>
          ) : (
            <div className="space-y-2">
              {packages.map((pkg) => (
                <div key={pkg.packageId} className="flex items-center justify-between">
                  <EntityLink to={`/packages/${pkg.packageId}`} label={pkg.packageNo} />
                  <StatusBadge status={pkg.status} />
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
