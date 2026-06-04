import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import { useRegisteredUser } from "@/context/RegisteredUserContext"
import { Button } from "@/components/ui/button"
import { getLoginRedirectOptions } from "@/lib/authUtils"
import UserNameMenu from "./UserNameMenu"

export default function MainNav() {
  const { loginWithRedirect, isLoading: isAuth0Loading } = useAuth0()
  const { isLoggedIn, isDbUserLoading } = useRegisteredUser()

  if (isAuth0Loading || isDbUserLoading) {
    return null
  }

  if (!isLoggedIn) {
    return (
      <Button
        variant="ghost"
        type="button"
        className="font-bold text-[#FDF1E2] hover:bg-[#FDF1E2] hover:text-[#655A7C]"
        onClick={async () => {
          await loginWithRedirect(getLoginRedirectOptions("/"))
        }}
      >
        Ingresar
      </Button>
    )
  }

  return (
    <span className="flex items-center gap-4">
      <Link
        to="/administrar"
        className="font-bold text-[#FDF1E2] hover:text-[#AB92BF]"
      >
        Administrar perfil
      </Link>
      <UserNameMenu />
    </span>
  )
}
