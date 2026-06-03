import { useAuth0 } from "@auth0/auth0-react"

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

export function useCreateUser() {
  const { getAccessTokenSilently } = useAuth0()
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  return {
    mutate: async (user: CreateUserRequest, options?: MutationOptions) => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience,
            scope: "openid profile email",
          },
        })
        await createUser(user, accessToken)
        options?.onSuccess?.()
      } catch (error) {
        options?.onError?.(
          error instanceof Error ? error : new Error("Error creando usuario")
        )
      }
    },
  }
}
