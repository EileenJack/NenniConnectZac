import type { LogoutOptions, RedirectLoginOptions } from "@auth0/auth0-react"

export const getLogoutOptions = (): LogoutOptions => ({
  logoutParams: {
    returnTo: window.location.origin,
  },
})

export const getLoginRedirectOptions = (
  returnTo = "/",
): RedirectLoginOptions => ({
  appState: { returnTo },
  authorizationParams: {
    prompt: "login select_account",
    max_age: 0,
  },
})

export function formatAuth0Error(raw: string): string {
  const decoded = decodeURIComponent(raw.replace(/\+/g, " "))

  if (
    decoded.includes("not authorized to access resource server") ||
    decoded.includes("NenniConnectZacBackEnd")
  ) {
    return (
      "Auth0 no permite que la app use la API del backend. En Auth0 Dashboard: " +
      "Applications → tu app (NenniConnectZacFrontEnd) → pestaña APIs → activa " +
      '"NenniConnectZacBackEnd". Luego vuelve a intentar ingresar.'
    )
  }

  if (
    decoded.toLowerCase().includes("consent required") ||
    decoded === "consent_required"
  ) {
    return (
      "Auth0 necesita tu consentimiento para acceder a la API de NenniConnect. " +
      "Vuelve a presionar Ingresar y en la pantalla de Auth0 elige Accept/Aceptar. " +
      "Tambien puedes activar en Auth0: APIs → NenniConnectZacBackEnd → " +
      '"Allow Skipping User Consent" para aplicaciones de confianza.'
    )
  }

  return decoded
}

export function getAuth0CallbackError(search: string): string | null {
  const params = new URLSearchParams(search)
  const description = params.get("error_description")
  const code = params.get("error")
  if (!description && !code) return null
  return formatAuth0Error(description ?? code ?? "Error de autenticacion")
}
