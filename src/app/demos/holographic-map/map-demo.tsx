"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import {
  Map as CityMap,
  NavigationControl,
  setWorkerUrl,
  type GeoJSONSource,
  type MapGeoJSONFeature,
} from "maplibre-gl"
import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  Crosshair,
  Layers3,
  Minus,
  Orbit,
  Plus,
  RotateCcw,
  ScanLine,
  Square,
  X,
} from "lucide-react"
import {
  createHtmlProjectionLayer,
  type DrawableMapCanvas,
  type ProjectionSettings,
} from "./html-projection-layer"
import { mapStyle, selectionGeometry, sites, type Site } from "./map-data"
import { ProjectionCard, type PanelState } from "./projection-card"

function featureSite(
  feature: MapGeoJSONFeature | undefined,
  coordinates: [number, number]
): Site {
  const name = feature?.properties?.["name:zh"] || feature?.properties?.name
  const category =
    feature?.properties?.class || feature?.sourceLayer || "COORDINATE"
  const height = Number(feature?.properties?.render_height)
  return {
    id: "picked",
    name: typeof name === "string" ? name : "選定位置",
    subtitle: "CUSTOM GEO TARGET",
    coordinates,
    category: String(category).toUpperCase(),
    description:
      Number.isFinite(height) && height > 0
        ? `開放圖磚中的建築高度為 ${Math.round(height)} 公尺。可調整 HTML 投影高度，比較它與建築的空間關係。`
        : "這是你在地圖上選定的位置。可取得的地物資訊取自當前圖磚；未提供名稱或高度時，只顯示座標。",
  }
}

export default function MapDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef(new Map<string, HTMLDivElement>())
  const layerRef = useRef<ReturnType<typeof createHtmlProjectionLayer> | null>(
    null
  )
  const [map, setMap] = useState<CityMap | null>(null)
  const [supported, setSupported] = useState(false)
  const [mode, setMode] = useState<"spatial" | "overlay">("spatial")
  const [targets, setTargets] = useState<Site[]>([sites[0]])
  const [activeId, setActiveId] = useState<string | null>(sites[0].id)
  const selectedId = activeId ?? targets.at(-1)?.id ?? ""
  const orderedTargets = useMemo(
    () => [
      ...targets.filter((target) => target.id !== selectedId),
      ...targets.filter((target) => target.id === selectedId),
    ],
    [targets, selectedId]
  )
  const [altitude, setAltitude] = useState(180)
  const [strength, setStrength] = useState(0.75)
  const [occlusion, setOcclusion] = useState(true)
  const [frozen, setFrozen] = useState(false)
  const [orbit, setOrbit] = useState(false)
  const [scans, setScans] = useState(0)
  const [cardStates, setCardStates] = useState<
    Record<string, PanelState & { scans: number }>
  >({})
  const [mapError, setMapError] = useState("")
  const [nativeError, setNativeError] = useState("")
  const [retry, setRetry] = useState(0)
  const native = supported && mode === "spatial" && !nativeError
  const reportError = useCallback(
    (message: string) => setNativeError(message),
    []
  )

  const openTarget = useCallback((next: Site) => {
    const id =
      next.id === "picked"
        ? `pin-${next.coordinates[0].toFixed(5)}-${next.coordinates[1].toFixed(5)}`
        : next.id
    setTargets((current) =>
      current.some((target) => target.id === id)
        ? current
        : [...current, { ...next, id }]
    )
    setActiveId(id)
    setOrbit(false)
  }, [])

  function closeTarget(id: string) {
    setTargets((current) => current.filter((target) => target.id !== id))
    setActiveId((current) => (current === id ? null : current))
    setCardStates((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  useEffect(() => {
    if (!containerRef.current) return
    let instance: CityMap
    try {
      setWorkerUrl(
        new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href
      )
      instance = new CityMap({
        container: containerRef.current,
        style: mapStyle,
        center: [121.5637, 25.0368],
        zoom: 15.6,
        pitch: 57,
        bearing: -28,
        maxPitch: 75,
        maxZoom: 19,
        minZoom: 12,
        keyboard: false,
        canvasContextAttributes: { antialias: true },
      })
    } catch (error) {
      queueMicrotask(() =>
        setMapError(
          error instanceof Error ? error.message : "WebGL initialization failed"
        )
      )
      return
    }
    instance.addControl(
      new NavigationControl({ showCompass: false, showZoom: false }),
      "bottom-right"
    )
    instance.on("load", () => {
      const canvas = instance.getCanvas() as DrawableMapCanvas
      canvas.setAttribute("content", "drawable")
      const gl = canvas.getContext("webgl2")
      setSupported(
        canvas.content === "drawable" &&
          typeof canvas.requestPaint === "function" &&
          !!gl &&
          "texElementSubImage2D" in gl &&
          typeof canvas.updateElementGeometry === "function"
      )
      instance.addSource("selection", {
        type: "geojson",
        data: selectionGeometry(sites[0].coordinates, 300),
      })
      instance.addLayer({
        id: "selection-projection",
        type: "fill-extrusion",
        source: "selection",
        paint: {
          "fill-extrusion-color": "#ffb45e",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-opacity": 0.55,
          "fill-extrusion-base": 0,
        },
      })
      setMap(instance)
      setMapError("")
    })
    instance.on("click", (event) => {
      const target = event.originalEvent.target
      if (target instanceof Element && target.closest("[data-projection-card]"))
        return
      const features = instance
        .queryRenderedFeatures(event.point)
        .filter((feature) => feature.source === "city")
      const named =
        features.find((feature) => feature.properties?.name) ||
        features.find((feature) => feature.sourceLayer === "building") ||
        features[0]
      openTarget(featureSite(named, [event.lngLat.lng, event.lngLat.lat]))
      setOrbit(false)
    })
    instance.on("error", (event) => setMapError(event.error.message))
    return () => {
      instance.remove()
    }
  }, [retry, openTarget])

  useEffect(() => {
    if (!native || !map || !orderedTargets.length) return
    const initial: ProjectionSettings = {
      altitude: 180,
      strength: 0.75,
      occlusion: true,
      frozen: false,
    }
    const layer = createHtmlProjectionLayer(
      orderedTargets
        .map((target) => panelRefs.current.get(target.id))
        .filter((element): element is HTMLDivElement => !!element),
      initial,
      reportError
    )
    try {
      map.addLayer(layer)
      layerRef.current = layer
    } catch (error) {
      queueMicrotask(() =>
        reportError(
          error instanceof Error
            ? error.message
            : "Projection initialization failed"
        )
      )
    }
    return () => {
      layerRef.current = null
      if (map.getLayer(layer.id)) map.removeLayer(layer.id)
    }
  }, [map, native, orderedTargets, reportError])

  useEffect(() => {
    if (!map) return
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    layerRef.current?.configure({
      altitude,
      strength,
      occlusion,
      frozen: frozen || reduced,
    })
    const source = map.getSource("selection") as GeoJSONSource | undefined
    source?.setData({
      type: "FeatureCollection",
      features: orderedTargets.flatMap(
        (target) =>
          selectionGeometry(target.coordinates, altitude + 120).features
      ),
    })
  }, [map, native, orderedTargets, altitude, strength, occlusion, frozen])

  useEffect(() => {
    if (
      !map ||
      !orbit ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    let frame = 0
    let previous = 0
    function animate(time: number) {
      if (previous && map)
        map.setBearing(map.getBearing() + Math.min(time - previous, 50) * 0.003)
      previous = time
      frame = requestAnimationFrame(animate)
    }
    const stop = () => setOrbit(false)
    map.on("dragstart", stop)
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      map.off("dragstart", stop)
    }
  }, [map, orbit])

  function flyTo(next: Site) {
    openTarget(next)
    setOrbit(false)
    map?.flyTo({
      center: next.coordinates,
      zoom: 15.6,
      pitch: 57,
      bearing: -28,
      duration: 1500,
    })
  }

  function reset() {
    setAltitude(180)
    setStrength(0.75)
    setOcclusion(true)
    setFrozen(false)
    setNativeError("")
    flyTo(sites[0])
  }

  const panels = orderedTargets.map((target, index) => {
    const value = cardStates[target.id] ?? {
      note: "",
      range: 65,
      saved: false,
      active: true,
      tab: "location",
      scans: 0,
    }
    const update = (patch: Partial<PanelState & { scans: number }>) =>
      setCardStates((current) => ({
        ...current,
        [target.id]: { ...value, ...current[target.id], ...patch },
      }))
    return (
      <ProjectionCard
        key={target.id}
        site={target}
        native={native}
        panelRef={(element) => {
          if (element) panelRefs.current.set(target.id, element)
          else panelRefs.current.delete(target.id)
        }}
        scans={value.scans}
        onScan={() => {
          update({ scans: value.scans + 1 })
          setScans((count) => count + 1)
        }}
        value={value}
        onChange={update}
        onClose={() => closeTarget(target.id)}
        onActivate={() => setActiveId(target.id)}
        onHover={() => map?.triggerRepaint()}
        focused={selectedId === target.id}
        stackIndex={orderedTargets.length - 1 - index}
      />
    )
  })

  return (
    <main className="atlas-app">
      <header className="atlas-header">
        <Link href="/">
          <ArrowLeft size={13} /> COOL UI DESIGN
        </Link>
        <span>
          EXPERIMENT 005 <i>/</i> SPATIAL HTML
        </span>
        <Link href="/demos/html-in-canvas">
          CONTROL PANEL <ArrowUpRight size={12} />
        </Link>
      </header>
      <div className="atlas-title">
        <div>
          <p>
            <span /> GEOSPATIAL PROJECTION SYSTEM
          </p>
          <h1>
            ATLAS<span> / </span>
            <span className="atlas-title-light">
              Taipei, in another dimension.
            </span>
          </h1>
        </div>
        <div className="atlas-region">
          25°02′N 121°34′E <span>TAIWAN / XINYI DISTRICT</span>
        </div>
      </div>
      <div className="atlas-workspace">
        <aside className="atlas-sites">
          <p className="atlas-section-label">01 / POINTS OF INTEREST</p>
          <h2>
            Explore Taipei<span>選一個地標，或點擊地圖</span>
          </h2>
          <nav aria-label="Taipei landmarks">
            {sites.map((point, index) => (
              <button
                key={point.id}
                type="button"
                aria-pressed={selectedId === point.id}
                onClick={() => flyTo(point)}
              >
                <span className="site-index">0{index + 1}</span>
                <span>
                  {point.name}
                  <small>{point.subtitle}</small>
                </span>
                <ArrowUpRight size={12} />
              </button>
            ))}
          </nav>
          <div className="atlas-open-targets">
            <p>OPEN PROJECTIONS / {targets.length}</p>
            {targets.map((target) => (
              <div key={target.id}>
                <button
                  type="button"
                  aria-pressed={selectedId === target.id}
                  onClick={() => setActiveId(target.id)}
                >
                  {target.name}
                </button>
                <button
                  type="button"
                  aria-label={`Close projection: ${target.name}`}
                  onClick={() => closeTarget(target.id)}
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
          <div className="atlas-sidebar-note">
            <Box size={22} strokeWidth={1} />
            <p>
              真實的街廓。
              <br />
              真正的 HTML。
              <br />
              同一個 3D 場景。
            </p>
            <span>
              OPEN MAP DATA
              <br />
              LIVE DOM TEXTURES
            </span>
          </div>
          <div className="atlas-map-help">
            DRAG / 平移
            <br />
            RIGHT DRAG / 旋轉與傾斜
            <br />
            SCROLL / 縮放
          </div>
        </aside>
        <section
          className="atlas-viewport"
          aria-label="Interactive 3D Taipei map"
        >
          <div ref={containerRef} className="atlas-map" />
          <div className="atlas-map-top">
            <span>
              <span className="atlas-status-dot" />
              {map ? "CITY MODEL ONLINE" : "CONNECTING TO OPENFREEMAP"}
            </span>
            <span>LIVE / TAIPEI</span>
          </div>
          <div className="atlas-corner corner-nw" />
          <div className="atlas-corner corner-se" />
          {!map ? (
            <div className="atlas-map-loading">
              <Crosshair size={32} />
              <p>ACQUIRING CITY GEOMETRY…</p>
            </div>
          ) : null}
          {map && native ? (
            createPortal(panels, map.getCanvas())
          ) : (
            <div className="atlas-dom-projections">{panels}</div>
          )}
          {mapError ? (
            <div className="atlas-error" role="alert">
              地圖資料載入發生問題：{mapError}
              <button
                type="button"
                onClick={() => {
                  setMap(null)
                  setMapError("")
                  setRetry((value) => value + 1)
                }}
              >
                重新載入
              </button>
            </div>
          ) : null}
          <div className="atlas-map-tools">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => map?.zoomIn()}
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => map?.zoomOut()}
            >
              <Minus size={16} />
            </button>
            <button type="button" aria-label="Reset map view" onClick={reset}>
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="atlas-map-bottom">
            <span>
              {native
                ? "DOM → TEXTURE → WORLD SPACE"
                : "DOM OVERLAY / SCREEN SPACE"}
            </span>
            <span>BUILDINGS FROM OPEN DATA</span>
          </div>
          {scans > 0 ? (
            <div key={scans} className="atlas-scan-flash" aria-hidden="true" />
          ) : null}
        </section>
        <aside className="atlas-settings">
          <div className="atlas-settings-heading">
            <span className="atlas-section-label">02 / PROJECTION ENGINE</span>
            <Layers3 size={15} />
          </div>
          <div
            className="atlas-mode-switch"
            role="group"
            aria-label="Projection mode"
          >
            <button
              type="button"
              aria-pressed={mode === "spatial"}
              onClick={() => {
                setMode("spatial")
                setNativeError("")
              }}
            >
              <Box size={13} />
              Spatial HTML
            </button>
            <button
              type="button"
              aria-pressed={mode === "overlay"}
              onClick={() => setMode("overlay")}
            >
              <Square size={13} />
              DOM overlay
            </button>
          </div>
          <p className="atlas-mode-explanation">
            {native
              ? "點選多個地點建立投影；重疊時以 3D 堆疊呈現，懸停卡片可看到 pin 動畫。"
              : "一般 HTML 浮層固定在螢幕上，不參與地圖深度測試。"}
          </p>
          <div className="atlas-setting-block">
            <div>
              <label htmlFor="projection-altitude">PROJECTION ALTITUDE</label>
              <output htmlFor="projection-altitude">{altitude} m</output>
            </div>
            <input
              id="projection-altitude"
              type="range"
              min={0}
              max={400}
              step={5}
              value={altitude}
              disabled={!native}
              onChange={(event) => setAltitude(event.target.valueAsNumber)}
            />
            <p>降低高度，讓投影進入建築之間。</p>
          </div>
          <div className="atlas-setting-block">
            <div>
              <label htmlFor="holo-strength">HOLOGRAM SHADER</label>
              <output htmlFor="holo-strength">
                {Math.round(strength * 100)}%
              </output>
            </div>
            <input
              id="holo-strength"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={strength}
              disabled={!native}
              onChange={(event) => setStrength(event.target.valueAsNumber)}
            />
            <p>掃描光束直接作用在即時 HTML 像素上。</p>
          </div>
          <label className="atlas-check">
            <span>
              Building occlusion<small>共享地圖的 depth buffer</small>
            </span>
            <input
              type="checkbox"
              checked={occlusion}
              disabled={!native}
              onChange={(event) => setOcclusion(event.target.checked)}
            />
          </label>
          <label className="atlas-check">
            <span>
              Freeze shader<small>保留輸入與地圖操作</small>
            </span>
            <input
              type="checkbox"
              checked={frozen}
              disabled={!native}
              onChange={(event) => setFrozen(event.target.checked)}
            />
          </label>
          <button
            className="atlas-orbit"
            type="button"
            aria-pressed={orbit}
            onClick={() => setOrbit((value) => !value)}
          >
            <Orbit size={15} />
            {orbit ? "STOP CAMERA ORBIT" : "ORBIT THE CITY"}
          </button>
          <div
            className={`atlas-capability ${native ? "is-native" : ""}`}
            role="status"
          >
            <span>
              <span className="atlas-status-dot" />
              {native
                ? "NATIVE HTML TEXTURES"
                : map
                  ? "DOM OVERLAY ACTIVE"
                  : "INITIALIZING"}
            </span>
            <p>
              {nativeError
                ? `原生投影無法使用：${nativeError}`
                : native
                  ? "原生 HTML 材質，固定像素尺寸。懸停浮起 pin；點卡片置前，× 關閉。"
                  : supported
                    ? "切回 Spatial HTML，體驗空間投影。"
                    : "此環境未提供所需的 HTML-in-Canvas WebGL API，顯示 DOM 預覽。"}
            </p>
          </div>
          <div className="atlas-try">
            <ScanLine size={13} />
            <span>TRY THIS</span>
            <p>
              在投影卡輸入文字，再旋轉鏡頭。
              <br />
              切換 DOM overlay，對照兩者差異。
            </p>
          </div>
        </aside>
      </div>
      <footer className="atlas-footer">
        <span>ATLAS / HOLOGRAPHIC CARTOGRAPHY</span>
        <span>OPEN MAP · NATIVE HTML TEXTURES · SHARED DEPTH</span>
        <span>建築未提供高度時採示意值 / 掃描為互動示意</span>
      </footer>
    </main>
  )
}
