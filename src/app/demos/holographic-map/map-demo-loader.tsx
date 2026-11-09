"use client"

import dynamic from "next/dynamic"

export const MapDemoLoader = dynamic(() => import("./map-demo"), {
  ssr: false,
  loading: () => (
    <main className="atlas-loading">
      INITIALIZING ATLAS / LOADING MAP ENGINE…
    </main>
  ),
})
