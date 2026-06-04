import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { useRegisteredUser } from "@/context/RegisteredUserContext"
import Layout from "../layout/Layout"
import { getAllNegocios, type Negocio } from "../api/NegocioApi"
import BusinessCard from "../components/BusinessCard"
import FiltersBar from "../components/FiltersBar"

export default function HomePage() {
  const location = useLocation()
  const { authError: contextAuthError, clearAuthError } = useRegisteredUser()
  const routeAuthError = (location.state as { authError?: string } | null)
    ?.authError
  const authError = routeAuthError ?? contextAuthError

  useEffect(() => {
    if (routeAuthError) {
      clearAuthError()
    }
  }, [routeAuthError, clearAuthError])
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    keyword: "",
    categoria: "",
    ubicacion: "",
    precioMax: "",
    calificacionMin: "",
  })

  const apiFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([, value]) => String(value).trim() !== "")
      ),
    [filters]
  )

  useEffect(() => {
    const fetchNegocios = async () => {
      setIsLoading(true)
      try {
        const data = await getAllNegocios(apiFilters)
        setNegocios(data)
      } catch (error) {
        console.error("Error cargando negocios", error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchNegocios()
  }, [apiFilters])

  return (
    <Layout>
      <section className="mb-10 rounded-lg bg-[#AB92BF] p-8 text-center shadow-md">
        <h1 className="text-4xl font-bold text-[#FDF1E2] md:text-5xl">
          NeniConnectZac
        </h1>
        <p className="text-md mt-2 text-[#FDF1E2] md:text-lg">
          Encuentra negocios, servicios y emprendedores de Zacatecas.
        </p>
      </section>

      {authError && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-center text-amber-900"
        >
          {authError}
        </p>
      )}

      <FiltersBar filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <p className="mt-10 text-center text-gray-600">Cargando negocios...</p>
      ) : negocios.length === 0 ? (
        <p className="mt-10 text-center text-gray-600">
          No se encontraron negocios.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {negocios.map((negocio) => (
            <BusinessCard key={negocio._id} negocio={negocio} />
          ))}
        </div>
      )}
    </Layout>
  )
}
