import {
  BarChart3,
  Boxes,
  Factory as FactoryIcon,
  LayoutGrid,
  LayoutDashboard,
  Package,
  PackageSearch,
  Settings,
  ShoppingCart,
  Ship,
  Tags,
  Truck,
  Users,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Orders",
    items: [
      { label: "Orders", to: "/orders", icon: ShoppingCart },
      { label: "Customers", to: "/customers", icon: Users },
    ],
  },
  {
    label: "Procurement",
    items: [
      { label: "Purchases", to: "/purchases", icon: PackageSearch },
      { label: "Factories", to: "/factories", icon: FactoryIcon },
      { label: "Packages", to: "/packages", icon: Package },
    ],
  },
  {
    label: "Logistics",
    items: [{ label: "Shipments", to: "/shipments", icon: Ship }],
  },
  {
    label: "Inventory",
    items: [
      { label: "Receiving", to: "/receiving", icon: Boxes },
      { label: "Inventory", to: "/inventory", icon: LayoutGrid },
      { label: "Warehouses", to: "/warehouses", icon: WarehouseIcon },
    ],
  },
  {
    label: "Fulfillment",
    items: [{ label: "Deliveries", to: "/deliveries", icon: Truck }],
  },
  {
    label: "Catalog",
    items: [{ label: "Products", to: "/products", icon: Tags }],
  },
  {
    label: "Analytics",
    items: [{ label: "Reports", to: "/reports", icon: BarChart3 }],
  },
  {
    label: "System",
    items: [{ label: "Settings", to: "/settings", icon: Settings }],
  },
];
