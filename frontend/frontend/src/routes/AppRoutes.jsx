import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

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
import RecruiterJobs from "../pages/recruiter/Jobs"
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

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
);

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

        {/* Job Seeker */}
        <Route element={<ProtectedRoute role="job_seeker" />}>
          <Route path="/jobseeker" element={<JobSeekerLayout />}>
            <Route path="search" element={<PageTransition><SearchResults /></PageTransition>} />
            <Route path="dashboard" element={<PageTransition><JobSeekerDashboard /></PageTransition>} />
            <Route path="resumes" element={<PageTransition><Resumes /></PageTransition>} />
            <Route path="profile" element={<PageTransition><JobSeekerProfile /></PageTransition>} />
            <Route path="jobs" element={<PageTransition><Jobs /></PageTransition>} />
            <Route path="saved" element={<PageTransition><SavedJobs /></PageTransition>} />
            <Route path="applications" element={<PageTransition><AppliedJobs /></PageTransition>} />
            <Route path="applications/:id" element={<PageTransition><ApplicationDetail /></PageTransition>} />
            <Route path="chat" element={<PageTransition><ChatPage /></PageTransition>} />
            <Route path="chat/:conversationId" element={<PageTransition><ChatPage /></PageTransition>} />
            <Route path="companies" element={<PageTransition><Companies /></PageTransition>} />
            <Route path="companies/:companyId" element={<PageTransition><CompanyProfile /></PageTransition>} />
          </Route>
        </Route>

        {/* Recruiter */}
        <Route element={<ProtectedRoute role="recruiter" />}>
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route path="dashboard" element={<PageTransition><RecruiterDashboard /></PageTransition>} />
            <Route path="profile" element={<PageTransition><RecruiterProfile /></PageTransition>} />
            <Route path="company" element={<PageTransition><Company /></PageTransition>} />
            <Route path="search" element={<PageTransition><SearchCandidates /></PageTransition>} />
            <Route path="jobs" element={<PageTransition><RecruiterJobs /></PageTransition>} />
            <Route path="jobs/create" element={<PageTransition><CreateJob /></PageTransition>} />
            <Route path="jobs/:jobId" element={<PageTransition><RecruiterJobDetails /></PageTransition>} />
            <Route path="jobs/:jobId/edit" element={<PageTransition><RecruiterEditJob /></PageTransition>} />
            <Route path="jobs/:jobId/applicants" element={<PageTransition><Applicants /></PageTransition>} />
            <Route path="candidates/:userId" element={<PageTransition><ApplicantProfile /></PageTransition>} />
            <Route path="applicants/:applicationId/profile" element={<PageTransition><ApplicantProfile /></PageTransition>} />
            <Route path="chat" element={<PageTransition><ChatPage /></PageTransition>} />
            <Route path="chat/:conversationId" element={<PageTransition><ChatPage /></PageTransition>} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="users" element={<PageTransition><UserManagement /></PageTransition>} />
            <Route path="jobs" element={<PageTransition><JobManagement /></PageTransition>} />
            <Route path="ats" element={<PageTransition><ATSMonitoring /></PageTransition>} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AnimatePresence>
  )
}
