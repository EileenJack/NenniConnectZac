// frontend/src/components/Header.tsx
import MainNav from "./MainNav"

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-[#655A7C] px-6 py-4 shadow-md">
      <div className="text-2xl font-bold text-[#FDF1E2]">
        NENNI<span className="text-[#AB92BF]">CONNECT</span>
      </div>

      <MainNav />
    </header>
  )
}
