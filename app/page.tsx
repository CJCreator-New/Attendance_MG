"use client"

import dynamic from "next/dynamic"

// Dynamically import the React app to avoid SSR issues with react-router-dom
const AttendanceApp = dynamic(() => import("@/components/AttendanceApp"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Attendance Management System...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  return <AttendanceApp />
}
