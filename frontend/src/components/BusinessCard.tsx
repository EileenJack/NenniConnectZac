import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { Negocio } from "@/api/NegocioApi"
import { useRegisteredUser } from "@/context/RegisteredUserContext"
import { Link } from "react-router-dom"

export default function BusinessCard({ negocio }: { negocio: Negocio }) {
  const { isLoggedIn, dbUser } = useRegisteredUser()
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
      <AspectRatio ratio={16 / 9}>
        <div className="relative h-full w-full bg-[#EFD9CE]">
          {negocio.imagenUrl ? (
            <img
              src={negocio.imagenUrl}
              alt={negocio.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-lg font-bold text-[#655A7C]">
              {negocio.nombre}
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-[#655A7C]/80 p-2">
            <h3 className="truncate text-lg font-semibold text-[#FDF1E2]">
              {negocio.nombre}
            </h3>
          </div>
        </div>
      </AspectRatio>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-3 text-gray-700">{negocio.descripcion}</p>
        <p className="text-sm text-gray-600">{negocio.ubicacion}</p>
        {negocio.telefono && (
          <p className="text-sm text-gray-600">Tel: {negocio.telefono}</p>
        )}
        <p className="text-sm text-yellow-600">
          Calificacion: {negocio.calificacionPromedio || "0"} / 5
        </p>
        {Number(negocio.precioMinimo) > 0 && (
          <p className="text-sm text-gray-600">Desde ${negocio.precioMinimo}</p>
        )}

        {isLoggedIn && dbUser?.rol === "cliente" && (
          <Link
            to={`/negocios/${negocio._id}`}
            className="mt-auto rounded-md bg-[#655A7C] px-4 py-2 text-center font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
          >
            Ver detalle
          </Link>
        )}
      </div>
    </article>
  )
}
