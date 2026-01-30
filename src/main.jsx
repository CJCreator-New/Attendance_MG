import React, { useState, useEffect, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { CompanyProvider } from './features/settings/CompanyContext'
import { LoginPage } from './features/auth/LoginPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { MainLayout } from './layouts/MainLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { WelcomeScreen } from './components/WelcomeScreen'
import { ToastContainer } from './components/ToastContainer'
import { ConfirmDialog } from './components/ConfirmDialog'
import { LoadingSpinner } from './components/LoadingSpinner'
import { loadFromLocalStorage } from './utils/storage'
import './index.css'

const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const LeaveManagement = lazy(() => import('./features/leave/LeaveManagement').then(m => ({ default: m.LeaveManagement })));
const SalaryManagement = lazy(() => import('./features/salary/SalaryManagement').then(m => ({ default: m.SalaryManagement })));
const EmployeeManagementEnhanced = lazy(() => import('./features/employees/EmployeeManagementEnhanced').then(m => ({ default: m.EmployeeManagementEnhanced })));
const AdvancedReporting = lazy(() => import('./features/reports/AdvancedReporting').then(m => ({ default: m.AdvancedReporting })));
const SettingsPanelEnhanced = lazy(() => import('./features/settings/SettingsPanelEnhanced').then(m => ({ default: m.SettingsPanelEnhanced })));
const AttendanceSheet = lazy(() => import('./AttendanceSheet'));

const App = () => {
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
    const existingData = loadFromLocalStorage();
    return !hasSeenWelcome && (!existingData || !existingData.employees || existingData.employees.length === 0);
  });

  const handleWelcomeComplete = () => {
    localStorage.setItem('has_seen_welcome', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CompanyProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Suspense fallback={<LoadingSpinner size="lg" />}><Dashboard /></Suspense>} />
                <Route path="attendance" element={<Suspense fallback={<LoadingSpinner size="lg" />}><AttendanceSheet /></Suspense>} />
                <Route path="leave" element={<Suspense fallback={<LoadingSpinner size="lg" />}><LeaveManagement /></Suspense>} />
                <Route path="salary" element={<ProtectedRoute requiredPermission="canProcessPayroll"><Suspense fallback={<LoadingSpinner size="lg" />}><SalaryManagement /></Suspense></ProtectedRoute>} />
                <Route path="employees" element={<ProtectedRoute requiredPermission="canManageEmployees"><Suspense fallback={<LoadingSpinner size="lg" />}><EmployeeManagementEnhanced /></Suspense></ProtectedRoute>} />
                <Route path="reports" element={<Suspense fallback={<LoadingSpinner size="lg" />}><AdvancedReporting /></Suspense>} />
                <Route path="settings" element={<ProtectedRoute requiredPermission="canManageSettings"><Suspense fallback={<LoadingSpinner size="lg" />}><SettingsPanelEnhanced /></Suspense></ProtectedRoute>} />
              </Route>
            </Routes>
          </CompanyProvider>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer />
      <ConfirmDialog />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
