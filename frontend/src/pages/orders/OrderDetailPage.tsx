import React, { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Truck } from "lucide-react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressSteps } from "@/components/ui/Timeline";
import { CreateDeliveryModal } from "@/components/domain/CreateDeliveryModal";
import { CreatePurchaseDrawer } from "@/components/domain/CreatePurchaseDrawer";
import { EditOrderItemsDrawer } from "@/components/domain/EditOrderItemsDrawer";
import { DeliveryChainRow, FulfillmentChainRow } from "@/components/domain/FulfillmentChain";
import { getDeliverableItems } from "@/data/mutations";
import { getOrderDetail } from "@/data/repository";
import { getOrderItemPurchaseBreakdown, getOrderProgressSteps } from "@/data/selectors";
import { formatCurrency, formatDateLong } from "@/lib/format";

export function OrderDetailPage() {
  const { orderId = "" } = useParams();
  const [purchaseDrawerOpen, setPurchaseDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetail(orderId),
  });

  if (isLoading) {
    return <SkeletonBlock className="max-w-3xl" />;
  }

  if (isError || !data) {
    return <ErrorState title="Unable to load order" onRetry={refetch} />;
  }

  const { order, customer, items, purchaseChains, deliveries, attention } = data;
  const steps = getOrderProgressSteps(orderId);
  const canDeliver = getDeliverableItems(orderId).length > 0;

  function toggleItem(orderItemId: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(orderItemId)) next.delete(orderItemId);
      else next.add(orderItemId);
      return next;
    });
  }

  return (
    <div className="max-w-4xl">
      <DetailHeader
        backTo="/orders"
        backLabel="Orders"
        title={customer.name}
        code={order.orderNo}
        status={<StatusBadge status={order.status} />}
        meta={
          attention && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              {attention.reason}
            </span>
          )
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setEditDrawerOpen(true)}>
              Edit
            </Button>
            <Button variant="secondary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setPurchaseDrawerOpen(true)}>
              Add Purchase
            </Button>
            <Button
              variant="primary"
              icon={<Truck className="h-3.5 w-3.5" />}
              disabled={!canDeliver}
              title={canDeliver ? undefined : "Nothing purchased and undelivered yet"}
              onClick={() => setDeliveryModalOpen(true)}
            >
              Create Delivery
            </Button>
            <Button variant="ghost" className="px-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <Section className="mb-4" bodyClassName="overflow-x-auto px-6 py-5">
        <ProgressSteps steps={steps} />
      </Section>

      <Section
        title="Order Items"
        description="Expand Purchased to see which purchase(s) it came from"
        className="mb-4"
        noPadding
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-150 text-xs text-neutral-400">
              <th className="w-8 px-2 py-2" />
              <th className="px-2 py-2 text-left font-medium">Product</th>
              <th className="px-4 py-2 text-right font-medium">Ordered</th>
              <th className="px-4 py-2 text-right font-medium">Purchased</th>
              <th className="px-4 py-2 text-right font-medium">Delivered</th>
              <th className="px-4 py-2 text-right font-medium">Price</th>
              <th className="px-4 py-2 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const breakdown = getOrderItemPurchaseBreakdown(row.item.orderItemId);
              const isExpanded = expandedItems.has(row.item.orderItemId);
              return (
                <Fragment key={row.item.orderItemId}>
                  <tr className="border-b border-neutral-100 last:border-0">
                    <td className="px-2 py-2.5">
                      {breakdown.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleItem(row.item.orderItemId)}
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
                    <td className="px-2 py-2.5">
                      <p className="font-medium text-neutral-800">{row.product.name}</p>
                      <p className="text-xs text-neutral-400">
                        {row.product.productCode}
                        {row.variant.color ? ` · ${row.variant.color}` : ""}
                        {row.variant.groupName ? ` · ${row.variant.groupName}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 text-right text-neutral-700">{row.ordered}</td>
                    <td className="px-4 py-2.5 text-right text-neutral-700">
                      {row.purchased}
                      {breakdown.length > 1 && (
                        <span className="ml-1 text-xs text-neutral-400">({breakdown.length} purchases)</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-neutral-700">{row.delivered}</td>
                    <td className="px-4 py-2.5 text-right text-neutral-500">
                      {formatCurrency(row.item.price, order.currencyCode)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-neutral-800">
                      {formatCurrency(row.item.price * row.item.quantity, order.currencyCode)}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-neutral-100 bg-neutral-25 last:border-0">
                      <td colSpan={7} className="px-4 py-3">
                        <table className="w-full max-w-md text-xs">
                          <thead>
                            <tr className="text-neutral-400">
                              <th className="pb-1.5 text-left font-medium">Purchase</th>
                              <th className="pb-1.5 text-left font-medium">Factory</th>
                              <th className="pb-1.5 text-right font-medium">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {breakdown.map((b) => (
                              <tr key={b.purchaseId} className="border-t border-neutral-150">
                                <td className="py-1.5">
                                  <EntityLink to={`/purchases/${b.purchaseId}`} label={b.purchaseNo} />
                                </td>
                                <td className="py-1.5 text-neutral-600">{b.factoryName}</td>
                                <td className="py-1.5 text-right text-neutral-600">{b.quantity}</td>
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
          <tfoot>
            <tr className="border-t border-neutral-200">
              <td colSpan={6} className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500">
                Order Total
              </td>
              <td className="px-4 py-2.5 text-right font-semibold text-neutral-900">
                {formatCurrency(order.totalAmount, order.currencyCode)}
              </td>
            </tr>
          </tfoot>
        </table>
      </Section>

      <Section title="Fulfillment" description="Purchase → Package → Shipment → Receiving → Delivery">
        {purchaseChains.length === 0 && deliveries.length === 0 ? (
          <p className="text-sm text-neutral-400">No purchases have been created for this order yet.</p>
        ) : (
          <div className="space-y-3">
            {purchaseChains.map((chain) => (
              <FulfillmentChainRow key={chain.purchase.purchaseId} chain={chain} />
            ))}
            {deliveries.map((delivery) => (
              <div key={delivery.deliveryId} className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">
                  {delivery.deliveryDate
                    ? `Delivered on ${formatDateLong(delivery.deliveryDate)}`
                    : delivery.expectedDeliveryDate
                      ? `Expected ${formatDateLong(delivery.expectedDeliveryDate)}`
                      : "Not yet scheduled"}
                </span>
                <DeliveryChainRow delivery={delivery} />
              </div>
            ))}
          </div>
        )}
      </Section>

      <CreatePurchaseDrawer
        open={purchaseDrawerOpen}
        onClose={() => setPurchaseDrawerOpen(false)}
        onCreated={refetch}
      />
      <EditOrderItemsDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        orderId={orderId}
        items={items}
        onSaved={refetch}
      />
      <CreateDeliveryModal
        open={deliveryModalOpen}
        onClose={() => setDeliveryModalOpen(false)}
        orderId={orderId}
        onCreated={refetch}
      />
    </div>
  );
}
