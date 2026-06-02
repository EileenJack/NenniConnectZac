import {
  createNegocio,
  createServicio,
  getAllNegocios,
  type Negocio,
} from "@/api/NegocioApi"
import { useAuth0 } from "@auth0/auth0-react"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import Layout from "../layout/Layout"

const emptyNegocio = {
  nombre: "",
  descripcion: "",
  ubicacion: "",
  categoria: "",
  telefono: "",
  facebook: "",
  instagram: "",
  precioMinimo: "",
}

const emptyServicio = {
  negocioId: "",
  nombre: "",
  descripcion: "",
  precio: "",
}

export default function ManageNegocioPage() {
  const { getAccessTokenSilently } = useAuth0()
  const [negocioForm, setNegocioForm] = useState(emptyNegocio)
  const [servicioForm, setServicioForm] = useState(emptyServicio)
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [message, setMessage] = useState("")

  const loadNegocios = async () => {
    const data = await getAllNegocios()
    setNegocios(data)
  }

  useEffect(() => {
    void loadNegocios()
  }, [])

  const getToken = () =>
    getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    })

  const handleNegocioSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const accessToken = await getToken()
      await createNegocio(accessToken, {
        ...negocioForm,
        precioMinimo: Number(negocioForm.precioMinimo || 0),
      })
      setNegocioForm(emptyNegocio)
      setMessage("Negocio registrado correctamente")
      await loadNegocios()
    } catch (error) {
      console.error(error)
      setMessage("No se pudo registrar el negocio")
    }
  }

  const handleServicioSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const accessToken = await getToken()
      await createServicio(accessToken, {
        id_negocio: servicioForm.negocioId,
        nombre: servicioForm.nombre,
        descripcion: servicioForm.descripcion,
        precio: Number(servicioForm.precio),
      })
      setServicioForm(emptyServicio)
      setMessage("Servicio publicado correctamente")
    } catch (error) {
      console.error(error)
      setMessage("No se pudo publicar el servicio")
    }
  }

  return (
    <Layout>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-[#655A7C]">
            Registrar negocio
          </h1>
          <form onSubmit={handleNegocioSubmit} className="mt-4 grid gap-3">
            {(
              [
                ["nombre", "Nombre del negocio"],
                ["descripcion", "Descripcion"],
                ["ubicacion", "Ubicacion"],
                ["categoria", "Categoria"],
                ["telefono", "Telefono"],
                ["facebook", "Facebook"],
                ["instagram", "Instagram"],
                ["precioMinimo", "Precio minimo"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="grid gap-1">
                {label}
                <input
                  value={negocioForm[key]}
                  onChange={(event) =>
                    setNegocioForm((prev) => ({
                      ...prev,
                      [key]: event.target.value,
                    }))
                  }
                  className="rounded-md border px-3 py-2"
                  required={["nombre", "descripcion", "ubicacion", "categoria"].includes(
                    key
                  )}
                />
              </label>
            ))}
            <button
              type="submit"
              className="rounded-md bg-[#655A7C] px-4 py-2 font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
            >
              Guardar negocio
            </button>
          </form>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-[#655A7C]">
            Publicar servicio
          </h2>
          <form onSubmit={handleServicioSubmit} className="mt-4 grid gap-3">
            <label className="grid gap-1">
              Negocio
              <select
                value={servicioForm.negocioId}
                onChange={(event) =>
                  setServicioForm((prev) => ({
                    ...prev,
                    negocioId: event.target.value,
                  }))
                }
                className="rounded-md border px-3 py-2"
                required
              >
                <option value="">Selecciona un negocio</option>
                {negocios.map((negocio) => (
                  <option key={negocio._id} value={negocio._id}>
                    {negocio.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              Nombre del servicio
              <input
                value={servicioForm.nombre}
                onChange={(event) =>
                  setServicioForm((prev) => ({ ...prev, nombre: event.target.value }))
                }
                className="rounded-md border px-3 py-2"
                required
              />
            </label>
            <label className="grid gap-1">
              Descripcion
              <textarea
                value={servicioForm.descripcion}
                onChange={(event) =>
                  setServicioForm((prev) => ({
                    ...prev,
                    descripcion: event.target.value,
                  }))
                }
                className="min-h-24 rounded-md border px-3 py-2"
              />
            </label>
            <label className="grid gap-1">
              Precio
              <input
                type="number"
                min={0}
                value={servicioForm.precio}
                onChange={(event) =>
                  setServicioForm((prev) => ({ ...prev, precio: event.target.value }))
                }
                className="rounded-md border px-3 py-2"
                required
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-[#655A7C] px-4 py-2 font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
            >
              Publicar servicio
            </button>
          </form>
        </section>
      </div>

      {message && <p className="mt-4 text-center font-semibold text-[#655A7C]">{message}</p>}
    </Layout>
  )
}
