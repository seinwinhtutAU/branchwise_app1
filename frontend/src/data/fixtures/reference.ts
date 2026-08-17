import type { Customer, ExchangeRate, Factory, Product, ProductVariant, Warehouse } from "@/data/types";

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
  { productId: "PROD-1", productCode: "PROD-001", name: "Blue Shirt" },
  { productId: "PROD-2", productCode: "PROD-002", name: "Red Shirt" },
  { productId: "PROD-3", productCode: "PROD-003", name: "Black Hoodie" },
  { productId: "PROD-4", productCode: "PROD-004", name: "White Tee" },
  { productId: "PROD-5", productCode: "PROD-005", name: "Denim Jacket" },
  { productId: "PROD-6", productCode: "PROD-006", name: "Khaki Pants" },
  { productId: "PROD-7", productCode: "PROD-007", name: "Canvas Tote" },
  { productId: "PROD-8", productCode: "PROD-008", name: "Wool Scarf" },
  { productId: "PROD-9", productCode: "PROD-009", name: "Leather Belt" },
  { productId: "PROD-10", productCode: "PROD-010", name: "Sneakers" },
];

// Multiple variants can share one productCode — color and group (men/lady/
// child) are tracked per variant, and either may be unset (PV-7 has
// neither). PROD-9 shows the actual use case: two colors under one code.
export const productVariants: ProductVariant[] = [
  { variantId: "PV-1", productId: "PROD-1", color: "Blue", groupName: "men" },
  { variantId: "PV-2", productId: "PROD-2", color: "Red", groupName: "lady" },
  { variantId: "PV-3", productId: "PROD-3", color: "Black", groupName: "men" },
  { variantId: "PV-4", productId: "PROD-4", color: "White", groupName: "child" },
  { variantId: "PV-5", productId: "PROD-5", color: "Indigo", groupName: "lady" },
  { variantId: "PV-6", productId: "PROD-6", color: "Khaki", groupName: "men" },
  { variantId: "PV-7", productId: "PROD-7", color: null, groupName: null },
  { variantId: "PV-8", productId: "PROD-8", color: "Grey", groupName: null },
  { variantId: "PV-9", productId: "PROD-9", color: "Brown", groupName: "men" },
  { variantId: "PV-10", productId: "PROD-10", color: "White", groupName: "child" },
  { variantId: "PV-11", productId: "PROD-9", color: "Black", groupName: "men" },
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

// Current rate to MMK (the base reporting currency). Global, not per-date.
export const exchangeRates: ExchangeRate[] = [
  { currencyCode: "MMK", rateToBase: 1 },
  { currencyCode: "THB", rateToBase: 60 },
  { currencyCode: "CNY", rateToBase: 290 },
  { currencyCode: "BDT", rateToBase: 19 },
  { currencyCode: "VND", rateToBase: 0.085 },
];
