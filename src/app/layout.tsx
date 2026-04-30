import type { Metadata } from "next"
import { ThemeProvider } from "@/lib/theme"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cool UI Design",
  description: "A collection of sharings on how to design cool components",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}
