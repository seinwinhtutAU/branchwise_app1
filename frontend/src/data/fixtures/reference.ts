import type { Customer, Factory, Product, Warehouse } from "@/data/types";

export const customers: Customer[] = [
  { customerId: "CUST-1", name: "ABC Trading", phone: "+95 9 111 2233", address: "Yangon, Myanmar" },
  { customerId: "CUST-2", name: "XYZ Shop", phone: "+95 9 222 3344", address: "Mandalay, Myanmar" },
  { customerId: "CUST-3", name: "John Trading", phone: "+95 9 333 4455", address: "Yangon, Myanmar" },
  { customerId: "CUST-4", name: "Golden Gate Co.", phone: "+95 9 444 5566", address: "Naypyidaw, Myanmar" },
  { customerId: "CUST-5", name: "Silver Star Ltd", phone: "+95 9 555 6677", address: "Yangon, Myanmar" },
  { customerId: "CUST-6", name: "Everest Retail", phone: "+95 9 666 7788", address: "Mandalay, Myanmar" },
  { customerId: "CUST-7", name: "Blue Ocean Imports", phone: "+95 9 777 8899", address: "Yangon, Myanmar" },
  { customerId: "CUST-8", name: "Sunrise Wholesale", phone: "+95 9 888 9900", address: "Bago, Myanmar" },
];

export const products: Product[] = [
  { productId: "PROD-1", productCode: "PROD-001", name: "Blue Shirt", color: "Blue", size: "M" },
  { productId: "PROD-2", productCode: "PROD-002", name: "Red Shirt", color: "Red", size: "M" },
  { productId: "PROD-3", productCode: "PROD-003", name: "Black Hoodie", color: "Black", size: "L" },
  { productId: "PROD-4", productCode: "PROD-004", name: "White Tee", color: "White", size: "S" },
  { productId: "PROD-5", productCode: "PROD-005", name: "Denim Jacket", color: "Indigo", size: "L" },
  { productId: "PROD-6", productCode: "PROD-006", name: "Khaki Pants", color: "Khaki", size: "32" },
  { productId: "PROD-7", productCode: "PROD-007", name: "Canvas Tote", color: "Natural", size: "One Size" },
  { productId: "PROD-8", productCode: "PROD-008", name: "Wool Scarf", color: "Grey", size: "One Size" },
  { productId: "PROD-9", productCode: "PROD-009", name: "Leather Belt", color: "Brown", size: "34" },
  { productId: "PROD-10", productCode: "PROD-010", name: "Sneakers", color: "White", size: "42" },
];

export const factories: Factory[] = [
  { factoryId: "FAC-1", name: "Bangkok Textile Co.", phone: "+66 2 111 2233" },
  { factoryId: "FAC-2", name: "Hanoi Garments Ltd.", phone: "+84 24 222 3344" },
  { factoryId: "FAC-3", name: "Dhaka Apparel Works", phone: "+880 2 333 4455" },
  { factoryId: "FAC-4", name: "Guangzhou Manufacturing", phone: "+86 20 444 5566" },
];

export const warehouses: Warehouse[] = [
  { warehouseId: "WH-1", name: "Bangkok Warehouse" },
  { warehouseId: "WH-2", name: "Yangon Warehouse" },
  { warehouseId: "WH-3", name: "Mandalay Warehouse" },
];
