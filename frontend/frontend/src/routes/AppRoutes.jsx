import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ProtectedRoute from "./ProtectedRoute"

import JobSeekerLayout from "../components/layout/JobSeekerLayout"
import JobSeekerDashboard from "../pages/jobseeker/Dashboard"
import Resumes from "../pages/jobseeker/Resumes"

import RecruiterLayout from "../components/layout/RecruiterLayout"
import RecruiterDashboard from "../pages/recruiter/Dashboard"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Job Seeker */}
      <Route
        path="/jobseeker"
        element={
          <ProtectedRoute role="job_seeker">
            <JobSeekerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<JobSeekerDashboard />} />
        <Route path="resumes" element={<Resumes />} />
      </Route>

      {/* Recruiter */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<RecruiterDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
