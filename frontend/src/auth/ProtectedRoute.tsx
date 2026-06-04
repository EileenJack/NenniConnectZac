import { useRegisteredUser } from "@/context/RegisteredUserContext"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const { isLoggedIn, isDbUserLoading } = useRegisteredUser()

  if (isDbUserLoading) {
    return null
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />
}
