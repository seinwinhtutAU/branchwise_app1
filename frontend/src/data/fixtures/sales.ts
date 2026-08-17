import type { Order, OrderItem } from "@/data/types";

export const orders: Order[] = [
  {
    orderId: "SO-1024",
    orderNo: "SO-1024",
    customerId: "CUST-1",
    orderDate: "2026-08-16",
    source: "Wholesale Portal",
    status: "partially_fulfilled",
    totalAmount: 2650,
  },
  {
    orderId: "SO-1025",
    orderNo: "SO-1025",
    customerId: "CUST-2",
    orderDate: "2026-08-16",
    source: "Phone Order",
    status: "processing",
    totalAmount: 2485,
  },
  {
    orderId: "SO-1026",
    orderNo: "SO-1026",
    customerId: "CUST-3",
    orderDate: "2026-08-15",
    source: "Wholesale Portal",
    status: "fulfilled",
    totalAmount: 960,
  },
  {
    orderId: "SO-1031",
    orderNo: "SO-1031",
    customerId: "CUST-4",
    orderDate: "2026-08-14",
    source: "Email",
    status: "pending",
    totalAmount: 3800,
  },
  {
    orderId: "SO-1035",
    orderNo: "SO-1035",
    customerId: "CUST-5",
    orderDate: "2026-08-13",
    source: "Wholesale Portal",
    status: "processing",
    totalAmount: 2000,
  },
  {
    orderId: "SO-1042",
    orderNo: "SO-1042",
    customerId: "CUST-6",
    orderDate: "2026-08-12",
    source: "Phone Order",
    status: "processing",
    totalAmount: 2065,
  },
  {
    orderId: "SO-1048",
    orderNo: "SO-1048",
    customerId: "CUST-7",
    orderDate: "2026-08-10",
    source: "Wholesale Portal",
    status: "processing",
    totalAmount: 1800,
  },
  {
    orderId: "SO-1050",
    orderNo: "SO-1050",
    customerId: "CUST-8",
    orderDate: "2026-08-17",
    source: "Email",
    status: "draft",
    totalAmount: 2325,
  },
  {
    orderId: "SO-1052",
    orderNo: "SO-1052",
    customerId: "CUST-1",
    orderDate: "2026-08-09",
    source: "Wholesale Portal",
    status: "cancelled",
    totalAmount: 450,
  },
];

export const orderItems: OrderItem[] = [
  { orderItemId: "OI-1024-1", orderId: "SO-1024", productId: "PROD-1", quantity: 100, price: 12 },
  { orderItemId: "OI-1024-2", orderId: "SO-1024", productId: "PROD-2", quantity: 50, price: 15 },
  { orderItemId: "OI-1024-3", orderId: "SO-1024", productId: "PROD-3", quantity: 20, price: 35 },

  { orderItemId: "OI-1025-1", orderId: "SO-1025", productId: "PROD-4", quantity: 60, price: 8 },
  { orderItemId: "OI-1025-2", orderId: "SO-1025", productId: "PROD-5", quantity: 25, price: 45 },
  { orderItemId: "OI-1025-3", orderId: "SO-1025", productId: "PROD-6", quantity: 40, price: 22 },

  { orderItemId: "OI-1026-1", orderId: "SO-1026", productId: "PROD-4", quantity: 30, price: 8 },
  { orderItemId: "OI-1026-2", orderId: "SO-1026", productId: "PROD-8", quantity: 15, price: 18 },
  { orderItemId: "OI-1026-3", orderId: "SO-1026", productId: "PROD-5", quantity: 10, price: 45 },

  { orderItemId: "OI-1031-1", orderId: "SO-1031", productId: "PROD-9", quantity: 80, price: 20 },
  { orderItemId: "OI-1031-2", orderId: "SO-1031", productId: "PROD-10", quantity: 40, price: 55 },

  { orderItemId: "OI-1035-1", orderId: "SO-1035", productId: "PROD-6", quantity: 50, price: 22 },
  { orderItemId: "OI-1035-2", orderId: "SO-1035", productId: "PROD-7", quantity: 100, price: 9 },

  { orderItemId: "OI-1042-1", orderId: "SO-1042", productId: "PROD-1", quantity: 70, price: 12 },
  { orderItemId: "OI-1042-2", orderId: "SO-1042", productId: "PROD-3", quantity: 35, price: 35 },

  { orderItemId: "OI-1048-1", orderId: "SO-1048", productId: "PROD-2", quantity: 60, price: 15 },
  { orderItemId: "OI-1048-2", orderId: "SO-1048", productId: "PROD-9", quantity: 45, price: 20 },

  { orderItemId: "OI-1050-1", orderId: "SO-1050", productId: "PROD-5", quantity: 15, price: 45 },
  { orderItemId: "OI-1050-2", orderId: "SO-1050", productId: "PROD-10", quantity: 20, price: 55 },
  { orderItemId: "OI-1050-3", orderId: "SO-1050", productId: "PROD-6", quantity: 25, price: 22 },

  { orderItemId: "OI-1052-1", orderId: "SO-1052", productId: "PROD-7", quantity: 50, price: 9 },
];
