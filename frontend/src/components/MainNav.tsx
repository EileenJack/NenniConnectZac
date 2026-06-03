import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import UserNameMenu from "./UserNameMenu"

export default function MainNav() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: { returnTo: "/inicio_cliente" },
      authorizationParams: {
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      },
      openUrl: (url) => {
        window.location.assign(url)
      },
    })
  }

  return (
    <span className="flex items-center space-x-2">
      {isAuthenticated ? (
        <>
          <Link
            to="/inicio_cliente"
            className="font-bold text-[#FDF1E2] hover:text-[#AB92BF]"
          >
            Inicio
          </Link>
          <Link
            to="/inicio_emprende"
            className="font-bold text-[#FDF1E2] hover:text-[#AB92BF]"
          >
            Administrar
          </Link>
          <UserNameMenu />
        </>
      ) : (
        <button
          type="button"
          className="rounded-md px-3 py-2 font-bold text-[#FDF1E2] transition hover:bg-[#FDF1E2] hover:text-[#655A7C]"
          onClick={() => {
            void handleLogin()
          }}
        >
          Ingresar
        </button>
      )}
    </span>
  )
}
