"use client"

import type { ReactNode } from "react"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLang,
  CodeBlockToolbar,
} from "@notion-kit/code-block"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme"

interface SlideTemplateProps {
  title: string
  description?: string
  demo?: ReactNode
  content?: ReactNode
  code?: string
  lang?: string
}

export function SlideTemplate({
  title,
  description,
  demo,
  content,
  code,
  lang = "tsx",
}: SlideTemplateProps) {
  const { theme } = useTheme()
  const hasDemo = !!demo
  const hasCode = !!code
  const hasContent = content != null
  const hasRightPanel = hasContent || hasCode

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-8 md:p-12">
      <div className="mb-6">
        <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-lg text-secondary">{description}</p>
        )}
      </div>

      {(hasDemo || hasRightPanel) && (
        <div
          className={cn(
            "grid min-h-0 flex-1 gap-6",
            hasDemo && hasRightPanel && "grid-cols-[3fr_2fr]"
          )}
        >
          {hasDemo && (
            <div
              className={cn(
                "bg-card flex min-h-0 min-w-0 items-center justify-center rounded-lg border border-border p-6",
                hasRightPanel ? "lg:flex-1" : "flex-1"
              )}
            >
              {demo}
            </div>
          )}
          {hasContent ? (
            <div className="min-h-0 min-w-0 overflow-auto rounded-lg border border-border bg-popover p-6">
              {content}
            </div>
          ) : hasCode ? (
            <CodeBlock
              className="min-h-0"
              defaultValue={{
                code,
                lang,
                theme: `vitesse-${theme === "dark" ? "dark" : "light"}`,
              }}
              readonly
            >
              <CodeBlockLang />
              <CodeBlockToolbar />
              <CodeBlockContent className="overflow-auto" />
            </CodeBlock>
          ) : null}
        </div>
      )}

      {!hasDemo && !hasRightPanel && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-xl text-secondary">{title}</p>
        </div>
      )}
    </div>
  )
}
