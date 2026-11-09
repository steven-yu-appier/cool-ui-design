import type { CSSProperties, Ref } from "react"
import { ArrowUpRight, Crosshair, X, ScanLine, Send } from "lucide-react"
import type { Site } from "./map-data"

export type PanelState = {
  note: string
  range: number
  saved: boolean
  active: boolean
  tab: "location" | "scanner"
}

export function ProjectionCard({
  site,
  native,
  panelRef,
  scans,
  onScan,
  value,
  onChange,
  onClose,
  onActivate,
  onHover,
  focused,
  stackIndex,
}: {
  site: Site
  native: boolean
  panelRef: Ref<HTMLDivElement>
  scans: number
  onScan: () => void
  value: PanelState
  onChange: (patch: Partial<PanelState>) => void
  onClose: () => void
  onActivate: () => void
  onHover: () => void
  focused: boolean
  stackIndex: number
}) {
  const { note, range, saved, active, tab } = value
  return (
    <div
      ref={panelRef}
      {...(native ? { drawable: "" } : {})}
      className="atlas-card atlas-location"
      data-projection-card=""
      data-target-id={site.id}
      data-longitude={site.coordinates[0]}
      data-latitude={site.coordinates[1]}
      data-active={focused}
      style={{ "--stack-index": stackIndex } as CSSProperties}
      onPointerDown={onActivate}
      onFocusCapture={onActivate}
      onPointerEnter={onHover}
      onPointerLeave={onHover}
      aria-label={`Location projection: ${site.name}`}
    >
      <div className="projection-heading">
        <span>
          <Crosshair size={13} /> {site.name}
        </span>
        <button
          type="button"
          aria-label={`Close card: ${site.name}`}
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
        >
          <X size={13} />
        </button>
      </div>
      <>
        <div
          className="projection-tabs"
          role="tablist"
          aria-label="Location card view"
        >
          <button
            type="button"
            id={`${site.id}-location-tab`}
            role="tab"
            aria-selected={tab === "location"}
            aria-controls={`${site.id}-location-panel`}
            onClick={() => onChange({ tab: "location" })}
          >
            LOCATION
          </button>
          <button
            type="button"
            id={`${site.id}-scanner-tab`}
            role="tab"
            aria-selected={tab === "scanner"}
            aria-controls={`${site.id}-scanner-panel`}
            onClick={() => onChange({ tab: "scanner" })}
          >
            AREA SCANNER
          </button>
        </div>
        {tab === "location" ? (
          <div
            role="tabpanel"
            id={`${site.id}-location-panel`}
            aria-labelledby={`${site.id}-location-tab`}
          >
            <div className="projection-category">
              {site.category}
              <span>● TARGET ACQUIRED</span>
            </div>
            <h2>{site.name}</h2>
            <p className="projection-subtitle">{site.subtitle}</p>
            <p className="projection-description">{site.description}</p>
            <div className="coordinate-readout">
              <span>{site.coordinates[1].toFixed(5)}° N</span>
              <span>{site.coordinates[0].toFixed(5)}° E</span>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onChange({ saved: true })
              }}
            >
              <label htmlFor={`${site.id}-field-note`}>
                FIELD NOTE / 現場註記
              </label>
              <input
                id={`${site.id}-field-note`}
                value={note}
                maxLength={60}
                autoComplete="off"
                placeholder="在投影裡輸入文字…"
                onChange={(event) =>
                  onChange({ note: event.target.value, saved: false })
                }
              />
              <button type="submit">
                <Send size={12} />
                {saved ? "NOTE CAPTURED" : "SAVE FIELD NOTE"}
                <ArrowUpRight size={13} />
              </button>
            </form>
            <div className="projection-foot" role="status">
              {saved
                ? note || "已儲存空白註記"
                : "SEMANTIC HTML · NATIVE INPUT EVENTS"}
            </div>
          </div>
        ) : (
          <div
            role="tabpanel"
            id={`${site.id}-scanner-panel`}
            aria-labelledby={`${site.id}-scanner-tab`}
            className="projection-scan-body"
          >
            <h2>{site.name}</h2>
            <p className="projection-subtitle">
              AREA SCANNER / LIVE HTML CHART
            </p>
            <div className="scanner-status">
              <span>SIMULATION / 示意掃描</span>
              <button
                type="button"
                role="switch"
                aria-label="Scanner uplink"
                aria-checked={active}
                onClick={() => onChange({ active: !active })}
              >
                {active ? "ONLINE" : "OFFLINE"}
              </button>
            </div>
            <div className="spectrum" aria-hidden="true">
              {[
                0.32, 0.5, 0.8, 0.45, 0.95, 0.65, 0.4, 0.85, 0.55, 0.72, 0.35,
                0.6,
              ].map((scale, i) => (
                <i
                  key={i}
                  style={{
                    height: `${active ? Math.max(8, scale * range) : 5}%`,
                  }}
                />
              ))}
            </div>
            <div className="scanner-range">
              <label htmlFor={`${site.id}-scan-range`}>SCAN RADIUS</label>
              <output htmlFor={`${site.id}-scan-range`}>{range * 10} m</output>
            </div>
            <input
              id={`${site.id}-scan-range`}
              type="range"
              min={10}
              max={100}
              value={range}
              onChange={(event) =>
                onChange({ range: event.target.valueAsNumber })
              }
            />
            <button
              className="scanner-trigger"
              type="button"
              disabled={!active}
              onClick={onScan}
            >
              <ScanLine size={13} />
              RUN SCAN<span>{String(scans).padStart(2, "0")}</span>
            </button>
            <div className="projection-foot" role="status">
              {scans
                ? `SCAN ${String(scans).padStart(3, "0")} COMPLETE · R${range * 10}m`
                : "HTML BARS → GPU TEXTURE → SHADER"}
            </div>
          </div>
        )}
      </>
    </div>
  )
}
