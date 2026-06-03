import { Auth0Provider } from "@auth0/auth0-react"
import type { AppState } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"
import AuthUserSync from "./AuthUserSync"

type Props = {
  children: React.ReactNode
}

export default function Auth0ProviderWithNavigate({ children }: Props) {
  const navigate = useNavigate()

  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo ?? "/inicio_cliente", { replace: true })
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <AuthUserSync />
      {children}
    </Auth0Provider>
  )
}
