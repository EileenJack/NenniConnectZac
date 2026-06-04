import type { AppUser } from "@/api/UserApi"

export function getDefaultRouteForRole(rol: AppUser["rol"]): string {
  switch (rol) {
    case "admin":
    case "emprendedor":
      return "/administrar"
    case "cliente":
    default:
      return "/"
  }
}
