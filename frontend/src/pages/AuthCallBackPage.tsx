import { NotRegisteredError } from "@/api/UserApi"
import { useLinkAuth0User } from "@/api/UserApi"
import { useRegisteredUser } from "@/context/RegisteredUserContext"
import { getDefaultRouteForRole } from "@/lib/roleRoutes"
import { getAuth0CallbackError } from "@/lib/authUtils"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function AuthCallBackPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth0()
  const linkAuth0User = useLinkAuth0User()
  const { setDbUser, openRegistration } = useRegisteredUser()
  const hasVerifiedUser = useRef(false)

  const appState = location.state as { returnTo?: string } | null

  useEffect(() => {
    const callbackError = getAuth0CallbackError(location.search)
    if (callbackError) {
      navigate("/", { replace: true, state: { authError: callbackError } })
    }
  }, [location.search, navigate])

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return
    if (hasVerifiedUser.current) return

    hasVerifiedUser.current = true

    linkAuth0User
      .mutate(
        {
          email: user.email,
          name: user.name ?? user.email,
        },
        {
          onSuccess: (linkedUser) => {
            setDbUser(linkedUser)
            const destination =
              appState?.returnTo ?? getDefaultRouteForRole(linkedUser.rol)
            navigate(destination, { replace: true })
          },
          onError: (error) => {
            if (error instanceof NotRegisteredError) {
              openRegistration()
              navigate("/", { replace: true })
              return
            }

            navigate("/", {
              replace: true,
              state: {
                authError:
                  error.message ||
                  "No se pudo verificar tu cuenta en NenniConnect.",
              },
            })
          },
        },
      )
      .catch(() => {})
  }, [
    isAuthenticated,
    user,
    linkAuth0User,
    navigate,
    appState,
    setDbUser,
    openRegistration,
  ])

  return (
    <div className="flex min-h-screen items-center justify-center text-[#655A7C]">
      Verificando tu correo en NenniConnect...
    </div>
  )
}
