import { Link } from "react-router-dom"
import Layout from "@/layout/Layout"
import { useRegisteredUser } from "@/context/RegisteredUserContext"

export default function AdministrarPerfilPage() {
  const { dbUser, isDbUserLoading } = useRegisteredUser()

  if (isDbUserLoading) {
    return (
      <Layout>
        <p className="text-center text-gray-600">Cargando perfil...</p>
      </Layout>
    )
  }

  if (!dbUser) {
    return (
      <Layout>
        <section className="mx-auto max-w-lg rounded-lg bg-white p-8 shadow-md">
          <h1 className="text-2xl font-bold text-[#655A7C]">Administrar perfil</h1>
          <p className="mt-3 text-gray-700">
            Completa tu registro en NenniConnect para acceder a tu perfil.
          </p>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-[#655A7C]">Administrar perfil</h1>
        <p className="mt-2 text-gray-600">
          {dbUser.name} · {dbUser.email}
        </p>

        {dbUser.rol === "cliente" && (
          <div className="mt-6 space-y-3">
            <h2 className="text-xl font-bold text-[#655A7C]">Panel de cliente</h2>
            <p className="text-gray-700">
              Desde aqui puedes explorar negocios y calificar servicios en Zacatecas.
            </p>
            <Link
              to="/"
              className="inline-block rounded-md bg-[#655A7C] px-4 py-2 font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
            >
              Ver negocios
            </Link>
          </div>
        )}

        {dbUser.rol === "emprendedor" && (
          <div className="mt-6 space-y-3">
            <h2 className="text-xl font-bold text-[#655A7C]">Panel de empresa</h2>
            <p className="text-gray-700">
              Administra la informacion de tu negocio, servicios y visibilidad.
            </p>
            <Link
              to="/inicio_emprende"
              className="inline-block rounded-md bg-[#655A7C] px-4 py-2 font-bold text-[#FDF1E2] hover:bg-[#AB92BF]"
            >
              Administrar negocio
            </Link>
          </div>
        )}

        {dbUser.rol === "admin" && (
          <div className="mt-6 space-y-3">
            <h2 className="text-xl font-bold text-[#655A7C]">Panel de administrador</h2>
            <p className="text-gray-700">
              Gestiona usuarios, negocios y contenido de la plataforma.
            </p>
          </div>
        )}
      </section>
    </Layout>
  )
}
