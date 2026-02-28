import { jwtDecode } from "jwt-decode"

export function getUserFromToken() {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const decoded = jwtDecode(token)

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token")
      return null
    }

    return decoded
  } catch {
    return null
  }
}
