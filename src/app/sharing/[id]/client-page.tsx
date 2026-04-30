"use client"

import Link from "next/link"
import { getSharingById } from "@/sharings"
import { Button } from "@/components/ui/button"
import { SlideViewer } from "./slide-viewer"

export function ClientSharingPage({ id }: { id: string }) {
  const sharing = getSharingById(id)

  if (!sharing) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Sharing not found</p>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <SlideViewer sharing={sharing} />
}
