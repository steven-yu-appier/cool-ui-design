import { useParams } from "@tanstack/react-router"
import { getSharingById } from "@/sharings"

export function SharingPage() {
  const { id } = useParams({ from: "/sharing/$id" })
  const sharing = getSharingById(id)

  if (!sharing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Sharing not found</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">
        {sharing.title} — {sharing.slides.length} slides (viewer coming in
        Phase 2)
      </p>
    </div>
  )
}
