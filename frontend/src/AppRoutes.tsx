import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout"
import ProtectedRoute from "./auth/ProtectedRoute"
import AuthCallBackPage from "@/pages/AuthCallBackPage"
import HomePage from "@/pages/HomePage"
import AdministrarPerfilPage from "@/pages/AdministrarPerfilPage"
import ManageNegocioPage from "@/pages/ManageNegocioPage"
import NegocioDetailPage from "@/pages/NegocioDetailPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth-callback" element={<AuthCallBackPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/administrar" element={<AdministrarPerfilPage />} />
        <Route path="/negocios/:id" element={<NegocioDetailPage />} />
        <Route
          path="/inicio_cliente"
          element={<Layout>Bienvenido, que deseas buscar?</Layout>}
        />
        <Route path="/inicio_emprende" element={<ManageNegocioPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes
