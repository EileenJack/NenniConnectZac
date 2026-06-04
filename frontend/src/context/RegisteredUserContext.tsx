import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  fetchCurrentUser,
  NotRegisteredError,
  type AppUser,
} from "@/api/UserApi"
import { formatAuth0Error } from "@/lib/authUtils"
import RegisterUserModal from "@/components/RegisterUserModal"

type RegisteredUserContextValue = {
  dbUser: AppUser | null
  isDbUserLoading: boolean
  isLoggedIn: boolean
  needsRegistration: boolean
  authError: string | null
  clearAuthError: () => void
  openRegistration: () => void
  closeRegistration: () => void
  refreshDbUser: () => Promise<void>
  setDbUser: (user: AppUser | null) => void
}

const RegisteredUserContext = createContext<RegisteredUserContextValue | null>(
  null,
)

export function RegisteredUserProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    user: auth0User,
  } = useAuth0()
  const [dbUser, setDbUser] = useState<AppUser | null>(null)
  const [isDbUserLoading, setIsDbUserLoading] = useState(false)
  const [needsRegistration, setNeedsRegistration] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const clearAuthError = useCallback(() => {
    setAuthError(null)
  }, [])

  const closeRegistration = useCallback(() => {
    setNeedsRegistration(false)
  }, [])

  const openRegistration = useCallback(() => {
    setNeedsRegistration(true)
  }, [])

  const refreshDbUser = useCallback(async () => {
    if (!isAuthenticated) {
      setDbUser(null)
      setNeedsRegistration(false)
      setAuthError(null)
      return
    }

    setIsDbUserLoading(true)
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })
      const user = await fetchCurrentUser(accessToken)
      setDbUser(user)
      setNeedsRegistration(false)
      setAuthError(null)
    } catch (error) {
      setDbUser(null)
      if (error instanceof NotRegisteredError) {
        setNeedsRegistration(true)
        setAuthError(null)
      } else {
        const message =
          error instanceof Error ? error.message : "Error de autenticacion"
        const normalized = message.toLowerCase()

        if (normalized.includes("consent required")) {
          setAuthError(formatAuth0Error(message))
          setNeedsRegistration(false)
        } else {
          setAuthError(formatAuth0Error(message))
        }
      }
    } finally {
      setIsDbUserLoading(false)
    }
  }, [isAuthenticated, getAccessTokenSilently])

  useEffect(() => {
    if (isAuth0Loading) return

    if (!isAuthenticated) {
      setDbUser(null)
      setNeedsRegistration(false)
      setAuthError(null)
      setIsDbUserLoading(false)
      return
    }

    void refreshDbUser()
  }, [isAuthenticated, isAuth0Loading, refreshDbUser])

  const isLoggedIn = isAuthenticated && dbUser !== null && !dbUser.bloqueado

  const value = useMemo(
    () => ({
      dbUser,
      isDbUserLoading: isAuth0Loading || isDbUserLoading,
      isLoggedIn,
      needsRegistration,
      authError,
      clearAuthError,
      openRegistration,
      closeRegistration,
      refreshDbUser,
      setDbUser,
    }),
    [
      dbUser,
      isAuth0Loading,
      isDbUserLoading,
      isLoggedIn,
      needsRegistration,
      authError,
      clearAuthError,
      openRegistration,
      closeRegistration,
      refreshDbUser,
    ],
  )

  return (
    <RegisteredUserContext.Provider value={value}>
      {children}
      {needsRegistration && auth0User?.email && (
        <RegisterUserModal
          email={auth0User.email}
          defaultName={auth0User.name ?? auth0User.email}
          onRegistered={(user) => {
            setDbUser(user)
            setNeedsRegistration(false)
          }}
          onClose={closeRegistration}
        />
      )}
    </RegisteredUserContext.Provider>
  )
}

export function useRegisteredUser() {
  const context = useContext(RegisteredUserContext)
  if (!context) {
    throw new Error("useRegisteredUser debe usarse dentro de RegisteredUserProvider")
  }
  return context
}
