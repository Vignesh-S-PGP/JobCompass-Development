import { Navigate } from "react-router-dom"
import { getUserFromToken } from "../utils/auth"

export default function ProtectedRoute({ children, role }) {
  const user = getUserFromToken()

  // 🔴 If NOT logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 🔴 If role mismatch → redirect
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />
  }

  // ✅ Authorized
  return children
}
