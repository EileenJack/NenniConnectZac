import { useCreateUser } from "@/api/UserApi"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useRef } from "react"

export default function AuthUserSync() {
  const { isAuthenticated, user } = useAuth0()
  const { mutate: createUser } = useCreateUser()
  const syncedEmail = useRef<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return
    if (syncedEmail.current === user.email) return

    syncedEmail.current = user.email

    void createUser(
      {
        email: user.email,
        name: user.name ?? user.email,
      },
      {
        onError: (error) => {
          console.error("No se pudo verificar el usuario en Atlas", error)
        },
      }
    )
  }, [createUser, isAuthenticated, user?.email, user?.name])

  return null
}
