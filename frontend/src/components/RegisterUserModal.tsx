import { useRegisterAuth0User } from "@/api/UserApi"
import type { AppUser } from "@/api/UserApi"
import { Button } from "@/components/ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import { getLogoutOptions } from "@/lib/authUtils"
import { useState, type FormEvent } from "react"

type Props = {
  email: string
  defaultName: string
  onRegistered: (user: AppUser) => void
  onClose: () => void
}

type FormState = {
  usuario: string
  name: string
}

function validateForm({ usuario, name }: FormState): string | null {
  const trimmedUsuario = usuario.trim()
  const trimmedName = name.trim()

  if (trimmedUsuario.length < 3) {
    return "El nombre de usuario debe tener al menos 3 caracteres."
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(trimmedUsuario)) {
    return "El usuario solo puede contener letras, numeros, punto, guion y guion bajo."
  }

  if (trimmedName.length < 2) {
    return "El nombre completo debe tener al menos 2 caracteres."
  }

  return null
}

export default function RegisterUserModal({
  email,
  defaultName,
  onRegistered,
  onClose,
}: Props) {
  const { logout } = useAuth0()
  const registerUser = useRegisterAuth0User()
  const [form, setForm] = useState<FormState>({
    usuario: "",
    name: defaultName,
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const validationError = validateForm(form)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    try {
      const user = await registerUser.mutate({
        email,
        name: form.name.trim(),
        usuario: form.usuario.trim(),
      })
      onRegistered(user)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo completar el registro",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onClose()
    logout(getLogoutOptions())
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2
          id="register-modal-title"
          className="text-xl font-bold text-[#655A7C]"
        >
          Usuario no registrado, deseas registrarte?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Tu correo <strong>{email}</strong> fue verificado por Auth0 pero aun no
          existe en NenniConnect. Completa el formulario para darte de alta en
          Atlas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Correo electronico
            <input
              type="email"
              value={email}
              readOnly
              className="cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-gray-600"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Nombre de usuario
            <input
              type="text"
              value={form.usuario}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, usuario: event.target.value }))
              }
              className="rounded-md border px-3 py-2 outline-none focus:border-[#655A7C] focus:ring-1 focus:ring-[#655A7C]"
              placeholder="ej. juan_perez"
              autoComplete="username"
              required
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Nombre completo
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="rounded-md border px-3 py-2 outline-none focus:border-[#655A7C] focus:ring-1 focus:ring-[#655A7C]"
              placeholder="Nombre y apellido"
              autoComplete="name"
              required
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#655A7C] text-[#FDF1E2] hover:bg-[#AB92BF]"
            >
              {isSubmitting ? "Registrando..." : "Registrarme"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
