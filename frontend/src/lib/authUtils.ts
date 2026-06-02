import type { LogoutOptions } from "@auth0/auth0-react"

export const getLogoutOptions = (): LogoutOptions => ({
  logoutParams: {
    returnTo: window.location.origin,
  },
})
