import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router"
import { ThemeProvider } from "@/lib/theme"
import { HomePage } from "@/pages/home"
import { SharingPage } from "@/pages/sharing"

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark">
      <Outlet />
    </ThemeProvider>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

const sharingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sharing/$id",
  component: SharingPage,
})

const routeTree = rootRoute.addChildren([homeRoute, sharingRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
