import React, { useEffect, useState } from "react";
import { Truck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { useToast } from "@/components/ui/Toast";
import { createDelivery, getDeliverableItems } from "@/data/mutations";

interface CreateDeliveryModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onCreated: () => void;
}

interface DeliveryLineDraft {
  variantId: string;
  productName: string;
  outstanding: number;
  quantity: number;
}

function defaultExpectedDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

export function CreateDeliveryModal({ open, onClose, orderId, onCreated }: CreateDeliveryModalProps) {
  const toast = useToast();
  const [lines, setLines] = useState<DeliveryLineDraft[]>([]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setLines(
        getDeliverableItems(orderId).map((row) => ({
          variantId: row.variant.variantId,
          productName: row.variant.color ? `${row.product.name} · ${row.variant.color}` : row.product.name,
          outstanding: row.outstanding,
          quantity: row.outstanding,
        })),
      );
      setExpectedDeliveryDate(defaultExpectedDate());
    }
  }, [open, orderId]);

  function updateQuantity(variantId: string, quantity: number) {
    setLines((prev) => prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)));
  }

  const hasQuantity = lines.some((l) => l.quantity > 0);
  const canSubmit = hasQuantity && expectedDeliveryDate.length > 0;

  async function handleConfirm() {
    setSubmitting(true);
    createDelivery(
      orderId,
      expectedDeliveryDate,
      lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
    );
    await new Promise((r) => setTimeout(r, 300));
    setSubmitting(false);
    toast.show("Delivery scheduled", "success");
    onCreated();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule Delivery"
      description="Choose how much of each product to deliver and a target date"
      width="w-[440px]"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!canSubmit} loading={submitting} onClick={handleConfirm}>
            Schedule Delivery
          </Button>
        </>
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Nothing ready to deliver"
          description="Products need to be purchased before they can be delivered."
        />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Expected delivery date</label>
            <input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              className="h-8 w-full rounded-md border border-neutral-200 px-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-[1fr,90px,110px] gap-2 text-[11px] font-medium text-neutral-400">
              <span>Product</span>
              <span>Outstanding</span>
              <span>Deliver</span>
            </div>
            {lines.map((line) => (
              <div key={line.variantId} className="grid grid-cols-[1fr,90px,110px] items-center gap-2">
                <span className="truncate text-sm font-medium text-neutral-800">{line.productName}</span>
                <span className="text-sm text-neutral-500">{line.outstanding}</span>
                <QuantityInput
                  value={line.quantity}
                  max={line.outstanding}
                  onChange={(v) => updateQuantity(line.variantId, v)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
