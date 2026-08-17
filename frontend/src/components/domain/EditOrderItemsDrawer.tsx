import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useToast } from "@/components/ui/Toast";
import { updateOrderItems } from "@/data/mutations";
import type { OrderItemFulfillment } from "@/data/selectors";
import { formatCurrency } from "@/lib/format";

interface EditOrderItemsDrawerProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  items: OrderItemFulfillment[];
  onSaved: () => void;
}

interface EditRow {
  orderItemId: string;
  productName: string;
  minQuantity: number;
  quantity: number;
  price: number;
}

export function EditOrderItemsDrawer({ open, onClose, orderId, items, onSaved }: EditOrderItemsDrawerProps) {
  const toast = useToast();
  const [rows, setRows] = useState<EditRow[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setRows(
        items.map((row) => ({
          orderItemId: row.item.orderItemId,
          productName: row.product.name,
          minQuantity: Math.max(1, row.delivered),
          quantity: row.ordered,
          price: row.item.price,
        })),
      );
    }
  }, [open, items]);

  function updateRow(orderItemId: string, patch: Partial<EditRow>) {
    setRows((prev) => prev.map((r) => (r.orderItemId === orderItemId ? { ...r, ...patch } : r)));
  }

  const total = rows.reduce((sum, r) => sum + r.quantity * r.price, 0);

  async function handleSave() {
    setSubmitting(true);
    updateOrderItems(
      orderId,
      rows.map((r) => ({ orderItemId: r.orderItemId, quantity: r.quantity, price: r.price })),
    );
    await new Promise((r) => setTimeout(r, 300));
    setSubmitting(false);
    toast.show("Order updated", "success");
    onSaved();
    onClose();
  }

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="Edit Order Items"
      description="Adjust quantities and prices"
      footer={
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Total <span className="font-semibold text-neutral-800">{formatCurrency(total)}</span>
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-2 rounded-md border border-neutral-200 p-2">
        <div className="grid grid-cols-[1fr,110px,90px] gap-2 px-0.5 text-[11px] font-medium text-neutral-400">
          <span>Product</span>
          <span>Quantity</span>
          <span>Price</span>
        </div>
        {rows.map((row) => (
          <div key={row.orderItemId} className="grid grid-cols-[1fr,110px,90px] items-center gap-2">
            <span className="truncate text-sm font-medium text-neutral-800">{row.productName}</span>
            <QuantityInput
              value={row.quantity}
              min={row.minQuantity}
              onChange={(v) => updateRow(row.orderItemId, { quantity: v })}
            />
            <input
              type="number"
              step="0.01"
              value={row.price}
              onChange={(e) => updateRow(row.orderItemId, { price: Number(e.target.value) || 0 })}
              className="h-8 w-full rounded-md border border-neutral-200 px-2 text-sm"
            />
          </div>
        ))}
      </div>
      {rows.some((r) => r.minQuantity > 1) && (
        <p className="mt-2 text-xs text-neutral-400">
          Quantity can&apos;t go below what&apos;s already been delivered for a line.
        </p>
      )}
    </SideDrawer>
  );
}
