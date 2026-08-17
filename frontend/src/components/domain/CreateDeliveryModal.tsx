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
  productId: string;
  productName: string;
  outstanding: number;
  quantity: number;
}

export function CreateDeliveryModal({ open, onClose, orderId, onCreated }: CreateDeliveryModalProps) {
  const toast = useToast();
  const [lines, setLines] = useState<DeliveryLineDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setLines(
        getDeliverableItems(orderId).map((row) => ({
          productId: row.product.productId,
          productName: row.product.name,
          outstanding: row.outstanding,
          quantity: row.outstanding,
        })),
      );
    }
  }, [open, orderId]);

  function updateQuantity(productId: string, quantity: number) {
    setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)));
  }

  const hasQuantity = lines.some((l) => l.quantity > 0);

  async function handleConfirm() {
    setSubmitting(true);
    createDelivery(
      orderId,
      lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
    );
    await new Promise((r) => setTimeout(r, 300));
    setSubmitting(false);
    toast.show("Delivery created", "success");
    onCreated();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Delivery"
      description="Choose how much of each product to deliver"
      width="w-[440px]"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!hasQuantity} loading={submitting} onClick={handleConfirm}>
            Create Delivery
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
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr,90px,110px] gap-2 text-[11px] font-medium text-neutral-400">
            <span>Product</span>
            <span>Outstanding</span>
            <span>Deliver</span>
          </div>
          {lines.map((line) => (
            <div key={line.productId} className="grid grid-cols-[1fr,90px,110px] items-center gap-2">
              <span className="truncate text-sm font-medium text-neutral-800">{line.productName}</span>
              <span className="text-sm text-neutral-500">{line.outstanding}</span>
              <QuantityInput
                value={line.quantity}
                max={line.outstanding}
                onChange={(v) => updateQuantity(line.productId, v)}
              />
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
