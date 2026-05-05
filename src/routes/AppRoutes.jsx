import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import ErrorBoundary from "../components/ErrorBoundory";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import PlatformDashboard from "@/features/dashboard/pages/PlatformDashboard";
import RolesPage from "@/features/rbac/pages/RolesPage";
import RoleSelection from "@/features/auth/pages/RoleSelection";
import AuditLogsPage from "@/features/auditLogs/pages/AuditLogsPage";
import VerifyUserPage from "@/features/auth/pages/VerifyUser";
import UsersPage from "@/features/rbac/pages/UsersPage";
import FeaturesPage from "@/features/rbac/pages/FeaturesPage";
// import ModulesPage from "@/features/rbac/pages/ModulePage";
import CategoriesPage from "@/features/Categories/pages/CategoriesPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import BrandsPage from "@/features/brands/pages/BrandPage";
import ServicesPage from "@/features/products/pages/ServicesPage";
import NotFound from "@/components/NotFound";
import ModulesPage from "@/features/rbac/pages/ModulesPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";

// Lazy-loaded pages
// const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes location={location}>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/verify-email" element={<VerifyUserPage />} />



        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>


            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <PlatformDashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <PlatformDashboard />
                </ErrorBoundary>
              }
            />

            <Route
              path="/rbac/roles"
              element={
                <ErrorBoundary>
                  <RolesPage />
                </ErrorBoundary>
              }
            />

            <Route
              path="/rbac/users"
              element={
                <ErrorBoundary>
                  <UsersPage />
                </ErrorBoundary>
              }
            />

            <Route
              path="/rbac/modules"
              element={
                <ErrorBoundary>
                  <ModulesPage />
                </ErrorBoundary>
              }
            />

            <Route
              path="/rbac/features"
              element={
                <ErrorBoundary>
                  <FeaturesPage />
                </ErrorBoundary>
              }
            />


            <Route
              path="/profile"
              element={
                <ErrorBoundary>
                  <ProfilePage />
                </ErrorBoundary>
              }
            />

            <Route
              path="/audit-logs"
              element={
                <ErrorBoundary>
                  <AuditLogsPage />
                </ErrorBoundary>
              }
            />


            <Route
              path="/catalog"
              element={
                <Outlet />
              }
            >

              <Route
                path="products"
                element={
                  <ErrorBoundary>
                    <ProductsPage />
                  </ErrorBoundary>
                }
              />

              <Route
                path="services"
                element={
                  <ErrorBoundary>
                    <ServicesPage />
                  </ErrorBoundary>
                }
              />

              <Route
                path="categories"
                element={
                  <ErrorBoundary>
                    <CategoriesPage />
                  </ErrorBoundary>
                }
              />

              <Route
                path="brands"
                element={
                  <ErrorBoundary>
                    <BrandsPage />
                  </ErrorBoundary>
                }
              />
            </Route>

            <Route
              path="/orders/orders"
              element={
                <ErrorBoundary>
                  <OrdersPage />
                </ErrorBoundary>
              }
            />
          </Route>
        </Route>

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={
            <ErrorBoundary>
              <NotFound />
            </ErrorBoundary>
          }
        />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
