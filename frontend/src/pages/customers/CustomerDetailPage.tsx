import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { DetailHeader } from "@/components/ui/DetailHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EntityLink } from "@/components/ui/EntityLink";
import { ErrorState } from "@/components/ui/ErrorState";
import { Section } from "@/components/ui/Section";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getCustomerDetail } from "@/data/repository";
import { formatCurrency, formatDate } from "@/lib/format";

export function CustomerDetailPage() {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerDetail(customerId),
  });

  if (isLoading) return <SkeletonBlock className="max-w-4xl" />;
  if (isError || !data) return <ErrorState title="Unable to load customer" onRetry={refetch} />;

  const { customer, orders, products, purchases, packages, deliveries } = data;

  return (
    <div className="max-w-4xl">
      <DetailHeader
        backTo="/customers"
        backLabel="Customers"
        title={customer.name}
        subtitle={[customer.phone, customer.address].filter(Boolean).join(" · ") || undefined}
      />

      <Section title="Orders" className="mb-4" noPadding>
        {orders.length === 0 ? (
          <EmptyState title="No orders yet" description="Orders placed by this customer will show up here." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-150 text-xs text-neutral-400">
                <th className="px-4 py-2 text-left font-medium">Order</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Date</th>
                <th className="px-4 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="cursor-pointer border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                >
                  <td className="px-4 py-2.5 font-medium text-neutral-800">{order.orderNo}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-2.5 text-neutral-500">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-2.5 text-right text-neutral-700">
                    {formatCurrency(order.totalAmount, order.currencyCode)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Products Ordered" description="Every product this customer has ordered, across all their orders" className="mb-4" noPadding>
        {products.length === 0 ? (
          <p className="px-4 py-3 text-sm text-neutral-400">No products ordered yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-150 text-xs text-neutral-400">
                <th className="px-4 py-2 text-left font-medium">Product</th>
                <th className="px-4 py-2 text-right font-medium">Total Ordered</th>
                <th className="px-4 py-2 text-right font-medium">Orders</th>
              </tr>
            </thead>
            <tbody>
              {products.map((row) => (
                <tr key={row.product.productId} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-2.5">
                    <EntityLink to={`/products/${row.product.productId}`} label={row.product.name} sublabel={row.product.productCode} />
                  </td>
                  <td className="px-4 py-2.5 text-right text-neutral-700">{row.totalOrdered}</td>
                  <td className="px-4 py-2.5 text-right text-neutral-500">{row.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <div className="grid grid-cols-2 gap-4">
        <Section title="Purchases" description="Stock bought to fulfill this customer's orders">
          {purchases.length === 0 ? (
            <p className="text-sm text-neutral-400">Nothing purchased yet.</p>
          ) : (
            <div className="space-y-2">
              {purchases.map((purchase) => (
                <div key={purchase.purchaseId} className="flex items-center justify-between">
                  <EntityLink to={`/purchases/${purchase.purchaseId}`} label={purchase.purchaseNo} />
                  <StatusBadge status={purchase.status} />
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Packages" description="Packed boxes containing this customer's products">
          {packages.length === 0 ? (
            <p className="text-sm text-neutral-400">Nothing packed yet.</p>
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

      <Section title="Deliveries" className="mt-4">
        {deliveries.length === 0 ? (
          <p className="text-sm text-neutral-400">Nothing delivered yet.</p>
        ) : (
          <div className="space-y-2">
            {deliveries.map((delivery) => (
              <div key={delivery.deliveryId} className="flex items-center justify-between">
                <EntityLink
                  to={`/deliveries/${delivery.deliveryId}`}
                  label={
                    delivery.deliveryDate
                      ? formatDate(delivery.deliveryDate)
                      : delivery.expectedDeliveryDate
                        ? `Expected ${formatDate(delivery.expectedDeliveryDate)}`
                        : delivery.deliveryId
                  }
                  sublabel={delivery.deliveryId}
                />
                <StatusBadge status={delivery.status} />
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
