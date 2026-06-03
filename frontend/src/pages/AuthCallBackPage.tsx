import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AuthCallBackPage() {
  const navigate = useNavigate()
  const { error, isAuthenticated, isLoading } = useAuth0()

  useEffect(() => {
    if (isLoading) return

    if (error) {
      console.error("Error en callback de Auth0", error)
      navigate("/", { replace: true })
      return
    }

    navigate(isAuthenticated ? "/inicio_cliente" : "/", { replace: true })
  }, [error, isAuthenticated, isLoading, navigate])

  return (
    <div className="p-6 text-[#655A7C]">
      Terminando inicio de sesion...
    </div>
  )
}
