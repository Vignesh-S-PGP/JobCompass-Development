import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import ProtectedRoute from "./ProtectedRoute"

import JobSeekerLayout from "../components/layout/JobSeekerLayout"
import JobSeekerDashboard from "../pages/jobseeker/Dashboard"
import Resumes from "../pages/jobseeker/Resumes"
import Jobs from "../pages/jobseeker/Jobs"
import JobSeekerProfile from "../pages/jobseeker/Profile"

import RecruiterLayout from "../components/layout/RecruiterLayout"
import RecruiterDashboard from "../pages/recruiter/Dashboard"
import CreateJob from "../pages/recruiter/CreateJob"
import RecruiterJobs from "../pages/recruiter/Jobs"   // ✅ ONLY THIS
import RecruiterProfile from "../pages/recruiter/Profile"
import Company from "../pages/recruiter/Company"
import Applicants from "../pages/recruiter/Applicants"
import AppliedJobs from "../pages/jobseeker/AppliedJobs"
import ApplicationDetail from "../pages/jobseeker/ApplicationDetail"
import ChatPage from "../pages/chat/ChatPage"
import ApplicantProfile from "../pages/recruiter/ApplicantProfile"; 
import SavedJobs from "../pages/jobseeker/SavedJobs";
import SearchCandidates from "../pages/recruiter/SearchCandidates"
import AdminLayout from "../components/layout/AdminLayout"
import AdminDashboard from "../pages/admin/Dashboard"
import UserManagement from "../pages/admin/UserManagement"
import JobManagement from "../pages/admin/JobManagement"
import ATSMonitoring from "../pages/admin/ATSMonitoring"
import RecruiterJobDetails from "../pages/recruiter/JobDetails"
import RecruiterEditJob from "../pages/recruiter/EditJob"
import Companies from "../pages/jobseeker/Companies";
import CompanyProfile from "../pages/jobseeker/CompanyProfile";
import SearchResults from "../pages/jobseeker/SearchResults";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Job Seeker */}
      {/* Job Seeker */}
<Route element={<ProtectedRoute role="job_seeker" />}>
  <Route path="/jobseeker" element={<JobSeekerLayout />}>
    <Route
path="search"
element={<SearchResults />}
/>
    <Route path="dashboard" element={<JobSeekerDashboard />} />
    <Route path="resumes" element={<Resumes />} />
    <Route path="profile" element={<JobSeekerProfile />} />
    <Route path="jobs" element={<Jobs />} />
    <Route path="saved" element={<SavedJobs />} />
    {/* ✅ Applied Jobs */}
    <Route path="applications" element={<AppliedJobs />} />
    <Route path="applications/:id" element={<ApplicationDetail />} />
    <Route path="chat" element={<ChatPage />} />
    <Route path="chat/:conversationId" element={<ChatPage />} />
    <Route path="companies" element={<Companies />} />
<Route path="companies/:companyId" element={<CompanyProfile />} />

  </Route>
</Route>


      {/* Recruiter */}
     <Route element={<ProtectedRoute role="recruiter" />}>
  <Route path="/recruiter" element={<RecruiterLayout />}>

    <Route path="dashboard" element={<RecruiterDashboard />} />
    <Route path="profile" element={<RecruiterProfile />} />
    <Route path="company" element={<Company />} />
    <Route path="search" element={<SearchCandidates />} />
    <Route path="jobs" element={<RecruiterJobs />} />
    <Route path="jobs/create" element={<CreateJob />} />
    <Route path="jobs/:jobId" element={<RecruiterJobDetails />} />
    <Route path="jobs/:jobId/edit" element={<RecruiterEditJob />} />
    <Route path="jobs/:jobId/applicants" element={<Applicants />} />
    <Route path="candidates/:userId" element={<ApplicantProfile />} />
    <Route path="applicants/:applicationId/profile" element={<ApplicantProfile />} />
    <Route path="chat" element={<ChatPage />} />
    <Route path="chat/:conversationId" element={<ChatPage />} />

  </Route>
</Route>

      {/* Admin */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobManagement />} />
        </Route>

      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="ats" element={<ATSMonitoring />} />
        </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}
