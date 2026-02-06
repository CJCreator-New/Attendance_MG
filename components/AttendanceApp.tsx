"use client"

import React, { useState, useEffect, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/src/features/auth/AuthContext"
import { CompanyProvider } from "@/src/features/settings/CompanyContext"
import { LoginPage } from "@/src/features/auth/LoginPage"
import { SignupPage } from "@/src/features/auth/SignupPage"
import { ProtectedRoute } from "@/src/features/auth/ProtectedRoute"
import { MainLayout } from "@/src/layouts/MainLayout"
import { ErrorBoundary } from "@/src/components/ErrorBoundary"
import { WelcomeScreen } from "@/src/components/WelcomeScreen"
import { ToastContainer } from "@/src/components/ToastContainer"
import { ConfirmDialog } from "@/src/components/ConfirmDialog"
import { LoadingSpinner } from "@/src/components/LoadingSpinner"
import { loadFromLocalStorage } from "@/src/utils/storageLocal"

const Dashboard = lazy(() =>
  import("@/src/features/dashboard/Dashboard").then((m) => ({
    default: m.Dashboard,
  }))
)
const LeaveManagement = lazy(() =>
  import("@/src/features/leave/LeaveManagement").then((m) => ({
    default: m.LeaveManagement,
  }))
)
const SalaryManagement = lazy(() =>
  import("@/src/features/salary/SalaryManagement").then((m) => ({
    default: m.SalaryManagement,
  }))
)
const EmployeeManagementEnhanced = lazy(() =>
  import("@/src/features/employees/EmployeeManagementEnhanced").then((m) => ({
    default: m.EmployeeManagementEnhanced,
  }))
)
const AdvancedReporting = lazy(() =>
  import("@/src/features/reports/AdvancedReporting").then((m) => ({
    default: m.AdvancedReporting,
  }))
)
const SettingsPanelEnhanced = lazy(() =>
  import("@/src/features/settings/SettingsPanelEnhanced").then((m) => ({
    default: m.SettingsPanelEnhanced,
  }))
)
const AttendanceSheet = lazy(() => import("@/src/AttendanceSheet"))
const TenantManagement = lazy(() => import("@/src/features/tenancy/TenantManagement"))
const BranchManagement = lazy(() => import("@/src/features/branches/BranchManagement"))
const ShiftManagement = lazy(() => import("@/src/features/shifts/ShiftManagement"))
const WorkflowBuilder = lazy(() => import("@/src/features/workflows/WorkflowBuilder"))

export default function AttendanceApp() {
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return false
    const hasSeenWelcome = localStorage.getItem("has_seen_welcome")
    const existingData = loadFromLocalStorage()
    return (
      !hasSeenWelcome &&
      (!existingData || !existingData.employees || existingData.employees.length === 0)
    )
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleWelcomeComplete = () => {
    localStorage.setItem("has_seen_welcome", "true")
    setShowWelcome(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  return (
    <>
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <CompanyProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="dashboard"
                    element={
                      <Suspense fallback={<LoadingSpinner size="lg" />}>
                        <Dashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="attendance"
                    element={
                      <Suspense fallback={<LoadingSpinner size="lg" />}>
                        <AttendanceSheet />
                      </Suspense>
                    }
                  />
                  <Route
                    path="leave"
                    element={
                      <Suspense fallback={<LoadingSpinner size="lg" />}>
                        <LeaveManagement />
                      </Suspense>
                    }
                  />
                  <Route
                    path="salary"
                    element={
                      <ProtectedRoute requiredPermission="canProcessPayroll">
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <SalaryManagement />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="employees"
                    element={
                      <ProtectedRoute requiredPermission="canManageEmployees">
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <EmployeeManagementEnhanced />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <Suspense fallback={<LoadingSpinner size="lg" />}>
                        <AdvancedReporting />
                      </Suspense>
                    }
                  />
                  <Route
                    path="tenants"
                    element={
                      <ProtectedRoute requiredPermission="canManageSettings">
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <TenantManagement />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="branches"
                    element={
                      <ProtectedRoute requiredPermission="canManageSettings">
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <BranchManagement />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="shifts"
                    element={
                      <ProtectedRoute requiredPermission="canManageSettings">
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <ShiftManagement />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="workflows"
                    element={
                      <ProtectedRoute requiredPermission="canManageSettings">
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <WorkflowBuilder />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute requiredPermission="canManageSettings">
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <SettingsPanelEnhanced />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </CompanyProvider>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
      <ToastContainer />
      <ConfirmDialog />
    </>
  )
}
