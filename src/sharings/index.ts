import type { SharingConfig } from "./types"
import { introSharing } from "./01-intro/registry"

export const sharings: SharingConfig[] = [introSharing]

export function getSharingById(id: string): SharingConfig | undefined {
  return sharings.find((s) => s.id === id)
}
