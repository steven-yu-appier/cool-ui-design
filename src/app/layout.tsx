import type { Metadata } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import { ThemeProvider } from "@/lib/theme"
import "./globals.css"
import { cn } from "@notion-kit/cn"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
})

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
    <html lang="en" suppressHydrationWarning className={ibmPlexMono.variable}>
      <body className={cn(ibmPlexMono.className, "antialiased")}>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}
