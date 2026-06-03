import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import UserNameMenu from "./UserNameMenu"

export default function MainNav() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo: "/inicio_cliente" },
      })
    } catch (error) {
      console.error("Error iniciando sesion con Auth0", error)
    }
  }

  return (
    <span className="flex items-center gap-4">
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
          className="rounded-full border border-[#FDF1E2] px-4 py-2 font-bold text-[#FDF1E2] transition hover:bg-[#FDF1E2] hover:text-[#655A7C]"
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
