import { Navigate, Outlet } from "react-router-dom"
import { getUserFromToken } from "../utils/auth"

export default function ProtectedRoute({ role }) {
  const user = getUserFromToken()

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
