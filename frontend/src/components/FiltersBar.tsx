type Filters = {
  keyword: string
  categoria: string
  ubicacion: string
  precioMax: string
  calificacionMin: string
}

export default function FiltersBar({
  filters,
  setFilters,
}: {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}) {
  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="mb-6 grid gap-3 md:grid-cols-5">
      <input
        type="search"
        placeholder="Buscar servicio o negocio"
        value={filters.keyword}
        onChange={(e) => updateFilter("keyword", e.target.value)}
        className="rounded-md border px-3 py-2"
      />
      <input
        type="text"
        placeholder="Categoria"
        value={filters.categoria}
        onChange={(e) => updateFilter("categoria", e.target.value)}
        className="rounded-md border px-3 py-2"
      />
      <input
        type="text"
        placeholder="Ubicacion"
        value={filters.ubicacion}
        onChange={(e) => updateFilter("ubicacion", e.target.value)}
        className="rounded-md border px-3 py-2"
      />
      <input
        type="number"
        min={0}
        placeholder="Precio maximo"
        value={filters.precioMax}
        onChange={(e) => updateFilter("precioMax", e.target.value)}
        className="rounded-md border px-3 py-2"
      />
      <input
        type="number"
        min={0}
        max={5}
        placeholder="Calificacion minima"
        value={filters.calificacionMin}
        onChange={(e) => updateFilter("calificacionMin", e.target.value)}
        className="rounded-md border px-3 py-2"
      />
    </div>
  )
}
