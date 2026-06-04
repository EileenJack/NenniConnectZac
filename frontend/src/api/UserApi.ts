import { useAuth0 } from "@auth0/auth0-react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const audience = import.meta.env.VITE_AUTH0_AUDIENCE

export type AppUser = {
  _id: string
  email: string
  name: string
  usuario?: string
  rol: string
  bloqueado?: boolean
}

export class NotRegisteredError extends Error {
  constructor(message = "Usuario no registrado") {
    super(message)
    this.name = "NotRegisteredError"
  }
}

type CreateUserRequest = {
  email: string
  name: string
}

export type RegisterAuth0UserRequest = {
  email: string
  name: string
  usuario: string
}

type MutationOptions = {
  onSuccess?: (user: AppUser) => void
  onError?: (error: Error) => void
}

async function getAccessToken(
  getAccessTokenSilently: ReturnType<typeof useAuth0>["getAccessTokenSilently"],
) {
  return getAccessTokenSilently({
    authorizationParams: {
      audience,
      scope: "openid profile email",
    },
  })
}

async function parseErrorMessage(res: Response, fallback: string) {
  const body = (await res.json().catch(() => ({}))) as {
    message?: string
    error?: string
  }
  return body.message ?? body.error ?? fallback
}

export async function fetchCurrentUser(accessToken: string): Promise<AppUser> {
  const res = await fetch(`${API_BASE_URL}/api/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (res.status === 404) {
    throw new NotRegisteredError(
      await parseErrorMessage(res, "Usuario no registrado en el sistema"),
    )
  }

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Error obteniendo usuario"))
  }

  return res.json()
}

async function linkAuth0User(
  user: CreateUserRequest,
  accessToken: string,
): Promise<AppUser> {
  const res = await fetch(`${API_BASE_URL}/api/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })

  if (res.status === 404) {
    throw new NotRegisteredError(
      await parseErrorMessage(res, "Usuario no registrado en el sistema"),
    )
  }

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Error verificando usuario"))
  }

  return res.json()
}

export async function registerAuth0User(
  payload: RegisterAuth0UserRequest,
  accessToken: string,
): Promise<AppUser> {
  const res = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Error registrando usuario"))
  }

  return res.json()
}

export function useLinkAuth0User() {
  const { getAccessTokenSilently } = useAuth0()

  return {
    mutate: async (user: CreateUserRequest, options?: MutationOptions) => {
      try {
        const accessToken = await getAccessToken(getAccessTokenSilently)
        const linkedUser = await linkAuth0User(user, accessToken)
        options?.onSuccess?.(linkedUser)
        return linkedUser
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Error verificando usuario")
        options?.onError?.(err)
        throw err
      }
    },
  }
}

export function useRegisterAuth0User() {
  const { getAccessTokenSilently } = useAuth0()

  return {
    mutate: async (
      payload: RegisterAuth0UserRequest,
      options?: MutationOptions,
    ) => {
      try {
        const accessToken = await getAccessToken(getAccessTokenSilently)
        const user = await registerAuth0User(payload, accessToken)
        options?.onSuccess?.(user)
        return user
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Error registrando usuario")
        options?.onError?.(err)
        throw err
      }
    },
  }
}

export function useCreateUser() {
  return useLinkAuth0User()
}
