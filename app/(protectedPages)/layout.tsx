import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/lib/ProtectRoutes"

export default function ProtectedRoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </>
  )
}
