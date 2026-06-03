// frontend/src/pages/AuthCallBackPage.tsx
import { useCreateUser } from "@/api/UserApi" // llama a tu endpoint backend
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function AuthCallBackPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth0()
  const createUserRequest = useCreateUser() // POST /api/users si no existe en Atlas
  const hasCreatedUser = useRef(false)

  const appState = location.state as { returnTo?: string } | null

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return

    if (hasCreatedUser.current) return

    hasCreatedUser.current = true

    // Crear o verificar usuario en Atlas
    createUserRequest.mutate(
      {
        email: user.email,
        name: user.name ?? user.email,
      },
      {
        onSuccess: () => {
          navigate(appState?.returnTo ?? "/", { replace: true })
        },
        onError: () => {
          navigate(appState?.returnTo ?? "/", { replace: true })
        },
      }
    )
  }, [isAuthenticated, user, createUserRequest, navigate, appState])

  return <div>Loading...</div>
}
