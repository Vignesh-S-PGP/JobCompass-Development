import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ProtectedRoute from "./ProtectedRoute"

import JobSeekerLayout from "../components/layout/JobSeekerLayout"
import JobSeekerDashboard from "../pages/jobseeker/Dashboard"
import Resumes from "../pages/jobseeker/Resumes"
import Jobs from "../pages/jobseeker/Jobs"
import Profile from "../pages/jobseeker/Profile"

import RecruiterLayout from "../components/layout/RecruiterLayout"
import RecruiterDashboard from "../pages/recruiter/Dashboard"
import CreateJob from "../pages/recruiter/CreateJob"
import RecruiterJobs from "../pages/recruiter/Jobs"   // ✅ ONLY THIS
import Company from "../pages/recruiter/Company"
import Applicants from "../pages/recruiter/Applicants"
import AppliedJobs from "../pages/jobseeker/AppliedJobs"
import ApplicationDetail from "../pages/jobseeker/ApplicationDetail"
// import JobseekerLayout from "../layouts/JobseekerLayout"


export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Job Seeker */}
      {/* Job Seeker */}
<Route element={<ProtectedRoute role="job_seeker" />}>
  <Route path="/jobseeker" element={<JobSeekerLayout />}>

    <Route path="dashboard" element={<JobSeekerDashboard />} />
    <Route path="resumes" element={<Resumes />} />
    <Route path="profile" element={<Profile />} />
    <Route path="jobs" element={<Jobs />} />

    {/* ✅ Applied Jobs */}
    <Route path="applications" element={<AppliedJobs />} />
    <Route path="applications/:id" element={<ApplicationDetail />} />

  </Route>
</Route>


      {/* Recruiter */}
      <Route element={<ProtectedRoute role="recruiter" />}>
        <Route path="/recruiter" element={<RecruiterLayout />}>

          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="company" element={<Company />} />
          <Route path="jobs/create" element={<CreateJob />} />

          {/* ✅ FIXED JOBS FLOW */}
          <Route path="jobs" element={<RecruiterJobs />} />
          <Route path="jobs/:jobId/applicants" element={<Applicants />} />

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}
