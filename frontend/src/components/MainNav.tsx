import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import UserNameMenu from "./UserNameMenu"

export default function MainNav() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()

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
        <Button
          variant="ghost"
          className="font-bold text-[#FDF1E2] hover:bg-[#FDF1E2] hover:text-[#655A7C]"
          onClick={async () =>
            await loginWithRedirect({
              appState: { returnTo: "/inicio_cliente" },
            })
          }
        >
          Ingresar
        </Button>
      )}
    </span>
  )
}
