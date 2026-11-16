import type { ReactNode } from "react"

export interface SlideConfig {
  id: string
  title: string
  description?: string
  notes?: string
  demo?: () => ReactNode
  content?: ReactNode
  code?: string
  lang?: string
}

export interface SharingConfig {
  id: string
  title: string
  description: string
  date: string
  slides: SlideConfig[]
}
