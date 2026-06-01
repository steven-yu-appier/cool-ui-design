import type { SharingConfig } from "./types"
import { introSharing } from "./01-intro/registry"
import { coolComponentsSharing } from "./02-cool-components/registry"
import { howIDesignComponentsSharing } from "./03-how-i-design-components/registry"

export const sharings: SharingConfig[] = [
  introSharing,
  coolComponentsSharing,
  howIDesignComponentsSharing,
]

export function getSharingById(id: string): SharingConfig | undefined {
  return sharings.find((s) => s.id === id)
}
