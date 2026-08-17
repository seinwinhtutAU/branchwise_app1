import * as fx from "@/data/fixtures";
import { getOrder, getOrderItemsWithFulfillment } from "@/data/selectors";

function nextSequentialId(prefix: string, existingIds: string[]): string {
  const numbers = existingIds
    .map((id) => Number(id.replace(`${prefix}-`, "")))
    .filter((n) => !Number.isNaN(n));
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 0;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---- orders: edit line items ------------------------------------------

export interface OrderItemEdit {
  orderItemId: string;
  quantity: number;
  price: number;
}

export function updateOrderItems(orderId: string, edits: OrderItemEdit[]): void {
  for (const edit of edits) {
    const item = fx.orderItems.find((i) => i.orderItemId === edit.orderItemId);
    if (!item) continue;
    item.quantity = edit.quantity;
    item.price = edit.price;
  }

  const order = getOrder(orderId);
  if (!order) return;
  const items = fx.orderItems.filter((i) => i.orderId === orderId);
  order.totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
}

// ---- deliveries: create from outstanding order items -------------------

export interface DeliveryLine {
  variantId: string;
  quantity: number;
}

export function getDeliverableItems(orderId: string) {
  return getOrderItemsWithFulfillment(orderId)
    .map((row) => ({ ...row, outstanding: row.purchased - row.delivered }))
    .filter((row) => row.outstanding > 0);
}

export function createDelivery(orderId: string, expectedDeliveryDate: string, lines: DeliveryLine[]): string {
  const deliveryId = nextSequentialId(
    "DL",
    fx.deliveries.map((d) => d.deliveryId),
  );

  fx.deliveries.push({
    deliveryId,
    orderId,
    expectedDeliveryDate,
    deliveryDate: null,
    status: "pending",
  });

  lines
    .filter((line) => line.quantity > 0)
    .forEach((line, index) => {
      fx.deliveryItems.push({
        deliveryItemId: `DLI-${deliveryId.replace("DL-", "")}-${index + 1}`,
        deliveryId,
        variantId: line.variantId,
        quantity: line.quantity,
        stockAllocationId: null,
        purchaseAllocationId: null,
      });
    });

  return deliveryId;
}

// ---- deliveries: confirm actually delivered -----------------------------

export function markDelivered(deliveryId: string): void {
  const delivery = fx.deliveries.find((d) => d.deliveryId === deliveryId);
  if (!delivery) return;
  delivery.status = "delivered";
  delivery.deliveryDate = todayIso();
}
