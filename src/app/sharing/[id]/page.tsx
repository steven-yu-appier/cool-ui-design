import { sharings } from "@/sharings"
import { ClientSharingPage } from "./client-page"

// This must be a Server Component to export generateStaticParams
export function generateStaticParams() {
  return sharings.map((sharing) => ({
    id: sharing.id,
  }))
}

export default async function SharingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // We can pass the id down to the Client Component
  return <ClientSharingPage id={id} />
}
