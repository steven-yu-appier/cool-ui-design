import type { ReactNode } from "react"
import { CodeBlock, CodeBlockContent } from "@notion-kit/code-block"

interface SlideTemplateProps {
  title: string
  description?: string
  demo?: ReactNode
  code?: string
  lang?: string
}

export function SlideTemplate({
  title,
  description,
  demo,
  code,
  lang = "tsx",
}: SlideTemplateProps) {
  const hasDemo = !!demo
  const hasCode = !!code

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-8 md:p-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-lg text-muted-foreground">{description}</p>
        )}
      </div>

      {(hasDemo || hasCode) && (
        <div
          className={`flex min-h-0 flex-1 gap-6 ${hasDemo && hasCode ? "flex-col lg:flex-row" : ""}`}
        >
          {hasDemo && (
            <div
              className={`flex items-center justify-center rounded-lg border border-border bg-card p-6 ${hasCode ? "lg:flex-1" : "flex-1"}`}
            >
              {demo}
            </div>
          )}
          {hasCode && (
            <div
              className={`min-h-0 overflow-auto rounded-lg ${hasDemo ? "lg:flex-1" : "flex-1"}`}
            >
              <CodeBlock
                defaultValue={{ code, lang, theme: "github-dark" }}
                readonly
              >
                <CodeBlockContent />
              </CodeBlock>
            </div>
          )}
        </div>
      )}

      {!hasDemo && !hasCode && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-xl text-muted-foreground">{title}</p>
        </div>
      )}
    </div>
  )
}
