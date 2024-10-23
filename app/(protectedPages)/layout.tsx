import ProtectedRoute from "@/lib/ProtectRoutes"

export default function ProtectedRoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
