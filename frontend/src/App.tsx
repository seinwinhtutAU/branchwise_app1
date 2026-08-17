import React, { useEffect } from "react";
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";

import { AppShell } from "@/layout/AppShell";
import { ConfigurationError } from "@/layout/ConfigurationError";
import { RequireAuth } from "@/layout/RequireAuth";
import { isSupabaseConfigured } from "@/constants/config";
import { useAuthStore } from "@/store/authStore";
import { LoginPage } from "@/pages/auth/LoginPage";
import { CustomerDetailPage } from "@/pages/customers/CustomerDetailPage";
import { CustomersListPage } from "@/pages/customers/CustomersListPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { DeliveriesListPage } from "@/pages/deliveries/DeliveriesListPage";
import { DeliveryDetailPage } from "@/pages/deliveries/DeliveryDetailPage";
import { FactoriesListPage } from "@/pages/factories/FactoriesListPage";
import { InventoryPage } from "@/pages/inventory/InventoryPage";
import { OrderDetailPage } from "@/pages/orders/OrderDetailPage";
import { OrdersListPage } from "@/pages/orders/OrdersListPage";
import { PackageDetailPage } from "@/pages/packages/PackageDetailPage";
import { PackagesListPage } from "@/pages/packages/PackagesListPage";
import { ProductDetailPage } from "@/pages/products/ProductDetailPage";
import { ProductsListPage } from "@/pages/products/ProductsListPage";
import { PurchaseDetailPage } from "@/pages/purchases/PurchaseDetailPage";
import { PurchasesListPage } from "@/pages/purchases/PurchasesListPage";
import { ReceivingDetailPage } from "@/pages/receiving/ReceivingDetailPage";
import { ReceivingListPage } from "@/pages/receiving/ReceivingListPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { ShipmentDetailPage } from "@/pages/shipments/ShipmentDetailPage";
import { ShipmentsListPage } from "@/pages/shipments/ShipmentsListPage";
import { WarehousesListPage } from "@/pages/warehouses/WarehousesListPage";

export function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    if (isSupabaseConfigured) initialize();
  }, [initialize]);

  if (!isSupabaseConfigured) {
    return <ConfigurationError />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/customers" element={<CustomersListPage />} />
          <Route path="/customers/:customerId" element={<CustomerDetailPage />} />

          <Route path="/purchases" element={<PurchasesListPage />} />
          <Route path="/purchases/:purchaseId" element={<PurchaseDetailPage />} />
          <Route path="/factories" element={<FactoriesListPage />} />
          <Route path="/packages" element={<PackagesListPage />} />
          <Route path="/packages/:packageId" element={<PackageDetailPage />} />

          <Route path="/shipments" element={<ShipmentsListPage />} />
          <Route path="/shipments/:shipmentId" element={<ShipmentDetailPage />} />

          <Route path="/receiving" element={<ReceivingListPage />} />
          <Route path="/receiving/:receivingId" element={<ReceivingDetailPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/warehouses" element={<WarehousesListPage />} />

          <Route path="/deliveries" element={<DeliveriesListPage />} />
          <Route path="/deliveries/:deliveryId" element={<DeliveryDetailPage />} />

          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
