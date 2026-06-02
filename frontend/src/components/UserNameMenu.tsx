import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import { getLogoutOptions } from "@/lib/authUtils"

export default function UserNameMenu() {
  const { logout, user } = useAuth0()

  const handleLogout = () => {
    logout(getLogoutOptions())
  }

  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-full bg-[#FDF1E2] px-4 py-2 font-bold text-[#655A7C]">
        {user?.email ?? user?.name}
      </summary>
      <div className="absolute right-0 z-10 mt-2 flex w-56 flex-col gap-2 rounded-md border border-[#AB92BF] bg-white p-3 shadow-lg">
        <Link
          to="/inicio_cliente"
          className="rounded-md px-3 py-2 font-bold text-[#655A7C] hover:bg-[#FDF1E2]"
        >
          Inicio cliente
        </Link>
        <Link
          to="/inicio_emprende"
          className="rounded-md px-3 py-2 font-bold text-[#655A7C] hover:bg-[#FDF1E2]"
        >
          Administrar negocio
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-[#655A7C] px-3 py-2 font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
        >
          Salir
        </button>
      </div>
    </details>
  )
}
