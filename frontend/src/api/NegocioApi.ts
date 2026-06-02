const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type Negocio = {
  _id: string
  nombre: string
  descripcion: string
  ubicacion: string
  categoria: string
  telefono?: string
  facebook?: string
  instagram?: string
  precioMinimo?: number
  imagenUrl?: string
  calificacionPromedio?: number
}

export type Servicio = {
  _id: string
  negocioId: string
  nombre: string
  descripcion?: string
  precio: number
  activo: boolean
}

export type Calificacion = {
  _id: string
  negocioId: string
  puntuacion: number
  comentarios?: string
}

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
})

export async function getAllNegocios(filters = {}): Promise<Negocio[]> {
  const query = new URLSearchParams(
    filters as Record<string, string>
  ).toString()

  const res = await fetch(`${API_BASE_URL}/api/negocios?${query}`)
  if (!res.ok) throw new Error("Error cargando negocios")

  const data = await res.json()
  return data.negocios ?? data
}

export async function getNegocioById(id: string): Promise<{
  negocio: Negocio
  servicios: Servicio[]
  calificaciones: Calificacion[]
}> {
  const res = await fetch(`${API_BASE_URL}/api/negocios/${id}`)
  if (!res.ok) throw new Error("Error cargando negocio")
  return res.json()
}

export async function createNegocio(
  accessToken: string,
  negocio: Partial<Negocio>
) {
  const res = await fetch(`${API_BASE_URL}/api/negocios`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(negocio),
  })

  if (!res.ok) throw new Error("Error registrando negocio")
  return res.json()
}

export async function deleteNegocio(accessToken: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/api/negocios/${id}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  })

  if (!res.ok) throw new Error("Error eliminando negocio")
  return res.json()
}

export async function getCategorias() {
  const res = await fetch(`${API_BASE_URL}/api/categorias`)
  if (!res.ok) throw new Error("Error cargando categorias")
  const data = await res.json()
  return data.categorias ?? []
}

export async function createServicio(
  accessToken: string,
  servicio: Partial<Servicio> & { id_negocio?: string }
) {
  const res = await fetch(`${API_BASE_URL}/api/servicios`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(servicio),
  })

  if (!res.ok) throw new Error("Error publicando servicio")
  return res.json()
}

export async function createCalificacion(
  accessToken: string,
  calificacion: { id_negocio: string; puntuacion: number; comentarios?: string }
) {
  const res = await fetch(`${API_BASE_URL}/api/calificaciones`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(calificacion),
  })

  if (!res.ok) throw new Error("Error registrando calificacion")
  return res.json()
}
