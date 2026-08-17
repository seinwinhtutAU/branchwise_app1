import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EntitySelector } from "@/components/ui/EntitySelector";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useToast } from "@/components/ui/Toast";
import * as fx from "@/data/fixtures";

interface DraftLine {
  id: number;
  productId: string | null;
  quantity: number;
  price: number;
}

let lineId = 0;

interface CreatePurchaseDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const factoryOptions = fx.factories.map((f) => ({ value: f.factoryId, label: f.name }));
const productOptions = fx.products.map((p) => ({ value: p.productId, label: p.name, sublabel: p.productCode }));

export function CreatePurchaseDrawer({ open, onClose, onCreated }: CreatePurchaseDrawerProps) {
  const toast = useToast();
  const [factoryId, setFactoryId] = useState<string | null>(null);
  const [lines, setLines] = useState<DraftLine[]>([{ id: lineId++, productId: null, quantity: 1, price: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  function addLine() {
    setLines((prev) => [...prev, { id: lineId++, productId: null, quantity: 1, price: 0 }]);
  }

  function removeLine(id: number) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLine(id: number, patch: Partial<DraftLine>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function reset() {
    setFactoryId(null);
    setLines([{ id: lineId++, productId: null, quantity: 1, price: 0 }]);
  }

  const canSubmit = factoryId && lines.some((l) => l.productId && l.quantity > 0);

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    toast.show("Purchase created", "success");
    reset();
    onClose();
    onCreated?.();
  }

  return (
    <SideDrawer
      open={open}
      onClose={() => {
        onClose();
      }}
      title="Create Purchase"
      description="Order stock from a factory"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!canSubmit} loading={submitting} onClick={handleSubmit}>
            Create Purchase
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600">Factory</label>
          <EntitySelector
            options={factoryOptions}
            value={factoryId}
            onChange={setFactoryId}
            placeholder="Select factory"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-600">Items</label>
          </div>

          <div className="space-y-2 rounded-md border border-neutral-200 p-2">
            <div className="grid grid-cols-[1fr,88px,80px,24px] gap-1.5 px-0.5 text-[11px] font-medium text-neutral-400">
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
              <span />
            </div>
            {lines.map((line) => (
              <div key={line.id} className="grid grid-cols-[1fr,88px,80px,24px] items-center gap-1.5">
                <EntitySelector
                  options={productOptions}
                  value={line.productId}
                  onChange={(v) => updateLine(line.id, { productId: v })}
                  placeholder="Select product"
                />
                <QuantityInput
                  value={line.quantity}
                  onChange={(v) => updateLine(line.id, { quantity: v })}
                  min={1}
                />
                <input
                  type="number"
                  value={line.price}
                  onChange={(e) => updateLine(line.id, { price: Number(e.target.value) || 0 })}
                  className="h-8 w-full rounded-md border border-neutral-200 px-2 text-sm"
                />
                <button
                  onClick={() => removeLine(line.id)}
                  disabled={lines.length === 1}
                  className="flex h-8 w-6 items-center justify-center text-neutral-300 hover:text-danger-600 disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addLine}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </button>
        </div>
      </div>
    </SideDrawer>
  );
}
