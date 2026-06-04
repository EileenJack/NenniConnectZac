import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"
import { useRegisteredUser } from "@/context/RegisteredUserContext"
import { getLogoutOptions } from "@/lib/authUtils"

export default function UserNameMenu() {
  const { logout, user } = useAuth0()
  const { dbUser, setDbUser } = useRegisteredUser()
  const navigate = useNavigate()

  const displayName =
    dbUser?.usuario ?? dbUser?.name ?? user?.name ?? user?.email ?? "Usuario"

  const handleLogout = () => {
    setDbUser(null)
    logout(getLogoutOptions())
    navigate("/", { replace: true })
  }

  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-full bg-[#FDF1E2] px-4 py-2 font-bold text-[#655A7C]">
        {displayName}
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-[#AB92BF] bg-white p-2 shadow-lg">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-md bg-[#655A7C] px-3 py-2 font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
        >
          Salir
        </button>
      </div>
    </details>
  )
}
