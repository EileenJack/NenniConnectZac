import { Auth0Provider } from "@auth0/auth0-react"
import type { AppState } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"

type Props = {
  children: React.ReactNode
}

export default function Auth0ProviderWithNavigate({ children }: Props) {
  const navigate = useNavigate()

  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL
  const onRedirectCallback = (appState?: AppState) => {
    navigate("/auth-callback", { state: appState })
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}
