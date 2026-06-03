import { useAuth0 } from "@auth0/auth0-react"
import { useCallback } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateUserRequest = {
  email: string
  name: string
}

type MutationOptions = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

async function createUser(user: CreateUserRequest, accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/api/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })

  if (!res.ok) throw new Error("Error creando usuario")
  return res.json()
}

async function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  let timeoutId: ReturnType<typeof setTimeout>

  const timeout = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms)
  })

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId)
  })
}

export function useCreateUser() {
  const { getAccessTokenSilently } = useAuth0()
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  const mutate = useCallback(
    async (user: CreateUserRequest, options?: MutationOptions) => {
      try {
        const accessToken = await withTimeout(
          getAccessTokenSilently({
            authorizationParams: {
              audience,
              scope: "openid profile email",
            },
          }),
          10000,
          "Tiempo agotado obteniendo token de Auth0"
        )

        await withTimeout(
          createUser(user, accessToken),
          10000,
          "Tiempo agotado verificando usuario en Atlas"
        )

        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(
          error instanceof Error ? error : new Error("Error creando usuario")
        )
      }
    },
    [audience, getAccessTokenSilently]
  )

  return {
    mutate,
  }
}
