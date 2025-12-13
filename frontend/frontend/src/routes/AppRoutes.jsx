import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"

import ProtectedRoute from "./ProtectedRoute"

import JobSeekerDashboard from "../pages/jobseeker/Dashboard"
// (later we’ll add recruiter/admin dashboards here)

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Job Seeker route */}
      <Route
        path="/jobseeker/dashboard"
        element={
          <ProtectedRoute role="job_seeker">
            <JobSeekerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
