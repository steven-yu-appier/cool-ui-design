import type { SharingConfig } from "./types"
import { introSharing } from "./01-intro/registry"
import { coolComponentsSharing } from "./02-cool-components/registry"

export const sharings: SharingConfig[] = [introSharing, coolComponentsSharing]

export function getSharingById(id: string): SharingConfig | undefined {
  return sharings.find((s) => s.id === id)
}
