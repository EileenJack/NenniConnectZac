import {
  createCalificacion,
  getNegocioById,
  type Calificacion,
  type Negocio,
  type Servicio,
} from "@/api/NegocioApi"
import { useAuth0 } from "@auth0/auth0-react"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Layout from "../layout/Layout"

export default function NegocioDetailPage() {
  const { id } = useParams()
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } =
    useAuth0()
  const [negocio, setNegocio] = useState<Negocio | null>(null)
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([])
  const [puntuacion, setPuntuacion] = useState("5")
  const [comentarios, setComentarios] = useState("")
  const [message, setMessage] = useState("")

  const loadNegocio = async () => {
    if (!id) return
    const data = await getNegocioById(id)
    setNegocio(data.negocio)
    setServicios(data.servicios)
    setCalificaciones(data.calificaciones)
  }

  useEffect(() => {
    void loadNegocio()
  }, [id])

  const handleRating = async (event: FormEvent) => {
    event.preventDefault()
    if (!id) return

    if (!isAuthenticated) {
      await loginWithRedirect({ appState: { returnTo: `/negocios/${id}` } })
      return
    }

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      })
      await createCalificacion(accessToken, {
        id_negocio: id,
        puntuacion: Number(puntuacion),
        comentarios,
      })
      setComentarios("")
      setMessage("Calificacion registrada correctamente")
      await loadNegocio()
    } catch (error) {
      console.error(error)
      setMessage("No se pudo registrar la calificacion")
    }
  }

  if (!negocio) {
    return (
      <Layout>
        <p>Cargando negocio...</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h1 className="text-3xl font-bold text-[#655A7C]">{negocio.nombre}</h1>
          <p className="mt-3 text-gray-700">{negocio.descripcion}</p>

          <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-[#655A7C]">Contacto</h2>
            <p>Ubicacion: {negocio.ubicacion}</p>
            <p>Telefono: {negocio.telefono ?? "No disponible"}</p>
            <p>Facebook: {negocio.facebook ?? "No disponible"}</p>
            <p>Instagram: {negocio.instagram ?? "No disponible"}</p>
            <p>Calificacion promedio: {negocio.calificacionPromedio ?? 0} / 5</p>
          </div>

          <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-[#655A7C]">
              Productos y servicios
            </h2>
            {servicios.length === 0 ? (
              <p className="text-gray-600">Este negocio aun no publico servicios.</p>
            ) : (
              <div className="mt-3 grid gap-3">
                {servicios.map((servicio) => (
                  <article key={servicio._id} className="rounded-md border p-3">
                    <h3 className="font-bold">{servicio.nombre}</h3>
                    <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                    <p className="font-semibold">${servicio.precio}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#655A7C]">Calificar negocio</h2>
          <form onSubmit={handleRating} className="mt-4 grid gap-3">
            <label className="grid gap-1">
              Puntuacion
              <select
                value={puntuacion}
                onChange={(event) => setPuntuacion(event.target.value)}
                className="rounded-md border px-3 py-2"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              Comentarios
              <textarea
                value={comentarios}
                onChange={(event) => setComentarios(event.target.value)}
                className="min-h-24 rounded-md border px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-[#655A7C] px-4 py-2 font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
            >
              Guardar calificacion
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-[#655A7C]">{message}</p>}

          <div className="mt-6">
            <h3 className="font-bold text-[#655A7C]">Opiniones</h3>
            {calificaciones.length === 0 ? (
              <p className="text-sm text-gray-600">Sin calificaciones todavia.</p>
            ) : (
              <div className="mt-3 grid gap-2">
                {calificaciones.map((calificacion) => (
                  <article key={calificacion._id} className="rounded-md bg-gray-50 p-3">
                    <p className="font-semibold">{calificacion.puntuacion} / 5</p>
                    <p className="text-sm text-gray-600">
                      {calificacion.comentarios ?? "Sin comentarios"}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>
    </Layout>
  )
}
