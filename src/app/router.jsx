import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteFallback from './RouteFallback';
import ProtectedRoute from '@features/auth/ProtectedRoute';

const HomePage = lazy(() => import('@pages/HomePage/HomePage'));
const CatalogPage = lazy(() => import('@pages/CatalogPage/CatalogPage'));
const PropertyDetailPage = lazy(() => import('@pages/PropertyDetailPage/PropertyDetailPage'));
const VirtualTourPage = lazy(() => import('@pages/VirtualTourPage/VirtualTourPage'));
const MortgagePage = lazy(() => import('@pages/MortgagePage/MortgagePage'));
const AnalyticsPage = lazy(() => import('@pages/AnalyticsPage/AnalyticsPage'));
const ARPlannerPage = lazy(() => import('@pages/ARPlannerPage/ARPlannerPage'));
const AuthPage = lazy(() => import('@pages/AuthPage/AuthPage'));
const ProfilePage = lazy(() => import('@pages/ProfilePage/ProfilePage'));

function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/property/:id/tour" element={<VirtualTourPage />} />
        <Route path="/mortgage" element={<MortgagePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ar-planner" element={<ARPlannerPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
