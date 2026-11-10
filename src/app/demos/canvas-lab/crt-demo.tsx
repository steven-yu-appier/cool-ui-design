"use client"

import { useCallback, useState } from "react"
import { Button } from "@base-ui/react/button"
import { Field } from "@base-ui/react/field"
import { Autocomplete } from "@base-ui/react/autocomplete"
import { Checkbox } from "@base-ui/react/checkbox"
import { PlayerSlider } from "./player-slider"
import {
  Check,
  Music2,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react"
import { useCrtScene } from "./use-crt-scene"
import { tracks, useSynthPlayer } from "./use-synth-player"

const trackOptions = tracks.map((track, index) => ({ ...track, index }))

function timestamp(value: number) {
  return `${Math.floor(value / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(value % 60)
    .toString()
    .padStart(2, "0")}`
}

export function CrtDemo() {
  const player = useSynthPlayer()
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [mode, setMode] = useState<"3d" | "html">("3d")
  const [effects, setEffects] = useState(true)
  const [strength, setStrength] = useState(0.65)
  const [error, setError] = useState("")
  const reportError = useCallback((message: string) => setError(message), [])
  const {
    supported,
    canvasRef,
    sourceRef,
    panelRef,
    sceneControls,
    signalGlitch,
  } = useCrtScene(!error && mode === "3d", effects, strength, reportError)
  const native = supported && !error && mode === "3d"
  function select(index: number) {
    signalGlitch()
    player.select(index)
  }

  const panel = (
    <div
      ref={panelRef}
      {...(native ? { drawable: "" } : {})}
      className="crt-panel"
    >
      <div className="crt-topline">
        <span>
          <i /> PHOSPHOR FM
        </span>
        <span>STEREO / 01–03</span>
      </div>
      <div className="crt-search-region">
        <Autocomplete.Root
          items={trackOptions}
          itemToStringValue={(track) => track.title}
          value={query}
          onValueChange={setQuery}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          openOnInputClick
          autoHighlight
        >
          <Field.Root className="crt-search">
            <Search size={18} />
            <Field.Label className="sr-only">搜尋歌曲</Field.Label>
            <Autocomplete.Input type="search" placeholder="Search tracks" />
          </Field.Root>
          {searchOpen ? (
            <div className="crt-search-menu">
              <Autocomplete.Empty className="crt-no-results">
                NO SIGNAL / 找不到歌曲
              </Autocomplete.Empty>
              <Autocomplete.List>
                {(track: (typeof trackOptions)[number]) => (
                  <Autocomplete.Item
                    key={track.title}
                    value={track}
                    className="crt-search-item"
                    onClick={() => select(track.index)}
                  >
                    <span className="track-number">
                      <Music2 size={18} aria-hidden="true" />
                    </span>
                    <span>{track.title}</span>
                    <span>{timestamp(track.duration)}</span>
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </div>
          ) : null}
        </Autocomplete.Root>
      </div>
      <div className="crt-track-list" aria-label="歌曲清單">
        {trackOptions.map((track) => (
          <Button
            key={track.title}
            className={player.index === track.index ? "is-active" : ""}
            aria-pressed={player.index === track.index}
            onClick={() => select(track.index)}
          >
            <span className="track-number">
              <Music2 size={18} aria-hidden="true" />
            </span>
            <span>{track.title}</span>
            <span>{timestamp(track.duration)}</span>
          </Button>
        ))}
      </div>
      <div className="crt-now">
        <span>NOW {player.playing ? "PLAYING" : "STANDING BY"}</span>
        <span>{timestamp(player.position)}</span>
      </div>
      <h3>{player.track.title}</h3>
      <p className="crt-artist">{player.track.artist}</p>
      <div
        className={`crt-wave ${player.playing ? "is-playing" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 48 }, (_, i) => (
          <i
            key={i}
            style={{
              height: `${Math.round(12 + (Math.sin(i * 1.7) + 1) * 18 + Math.sin(i * 0.17) ** 2 * 50)}%`,
              animationDelay: `${(i * -0.07).toFixed(2)}s`,
            }}
          />
        ))}
      </div>
      <div className="crt-seek">
        <PlayerSlider
          label="播放進度"
          value={player.position}
          max={player.track.duration - 0.1}
          step={0.1}
          onValueChange={player.seek}
        />
        <span>
          <span>{timestamp(player.position)}</span>
          <span>{timestamp(player.track.duration)} / LOOP</span>
        </span>
      </div>
      <div className="crt-transport">
        <Button
          aria-label="上一首"
          onClick={() =>
            select((player.index + tracks.length - 1) % tracks.length)
          }
        >
          <SkipBack />
        </Button>
        <Button
          className="crt-play"
          aria-label={player.playing ? "暫停" : "播放"}
          onClick={player.toggle}
        >
          {player.playing ? <Pause size={40} /> : <Play size={40} />}
        </Button>
        <Button
          aria-label="下一首"
          onClick={() => select((player.index + 1) % tracks.length)}
        >
          <SkipForward />
        </Button>
      </div>
      <div className="crt-volume">
        <Volume2 size={18} />
        <PlayerSlider
          label="音量"
          value={player.volume}
          max={1}
          step={0.01}
          onValueChange={player.setVolume}
        />
        <span>{Math.round(player.volume * 100)}%</span>
      </div>
    </div>
  )

  return (
    <section className="crt-experiment" id="crt">
      <div className="scene-toolbar">
        <span className={`engine-badge ${native ? "is-native" : ""}`}>
          {native ? "LIVE HTML / THREE.JS" : "DOM PREVIEW"}
        </span>
        <span className="scene-instruction">
          拖背景轉視角 · 滾輪縮放 · 螢幕直接操作
        </span>
        <div>
          <Button
            onClick={() =>
              setMode((current) => (current === "3d" ? "html" : "3d"))
            }
            disabled={!supported || !!error}
          >
            {mode === "3d" ? "HTML 預覽" : "返回 3D"}
          </Button>
          <Button
            onClick={() => sceneControls.current?.front()}
            disabled={!native}
          >
            正面
          </Button>
          <Button
            onClick={() => sceneControls.current?.reset()}
            disabled={!native}
          >
            重設視角
          </Button>
        </div>
      </div>
      {native ? (
        <div className="crt-scene">
          <canvas
            ref={canvasRef}
            {...{ content: "drawable" }}
            className="scene-canvas"
            aria-label="桌面上的 3D CRT 播放器，可拖曳背景旋轉視角"
          >
            <canvas
              ref={sourceRef}
              {...{ content: "drawable", drawable: "" }}
              width={1280}
              height={1280}
              className="source-canvas"
            >
              {panel}
            </canvas>
          </canvas>
          <div className="scene-caption" aria-hidden="true">
            <span>PHOSPHOR / MODEL 01</span>
            <span>LIVE TRANSMISSION — 1986 / 2026</span>
          </div>
        </div>
      ) : (
        <div className={`crt-fallback ${effects ? "effects-on" : ""}`}>
          {panel}
        </div>
      )}
      <div className="player-settings">
        <label>
          <Checkbox.Root
            className="effects-checkbox"
            checked={effects}
            onCheckedChange={setEffects}
          >
            <Checkbox.Indicator>
              <Check size={12} />
            </Checkbox.Indicator>
          </Checkbox.Root>
          CRT 效果
        </label>
        <div className="strength-setting">
          <span>訊號失真</span>
          <PlayerSlider
            label="訊號失真強度"
            value={strength}
            max={1}
            step={0.05}
            disabled={!effects || !native}
            onValueChange={setStrength}
          />
        </div>
        <span role="status">
          {player.error ||
            (player.playing
              ? `ON AIR / ${player.track.title}`
              : "三首合成樂段 · 按播放開始收聽")}
        </span>
      </div>
      {!native ? (
        <p className="fallback-note">
          {mode === "html"
            ? "原始 HTML 預覽。返回 3D 會保留搜尋、歌曲與播放狀態。"
            : error ||
              "這個瀏覽器未提供 HTML-in-Canvas API。目前顯示可操作的 HTML 播放器。"}
        </p>
      ) : null}
      <details className="lab-details">
        <summary>螢幕裡為什麼還能使用 HTML？</summary>
        <p>
          HTML 表單先由原生 2D HTML-in-Canvas 畫成即時影像，Three.js
          再把它當成螢幕材質，加入掃描線、RGB 色偏和掃光。相機移動時同步
          updateElementGeometry()，讓點擊、文字輸入與滑桿跟著螢幕走。HTML
          材質與玻璃共用凸面曲率。Raycaster 取得曲面 UV，轉回 HTML
          座標後處理點擊與拖曳；外圍另加模糊與色散。控制項使用 Base
          UI，支援鍵盤操作；波形是節奏示意。
        </p>
      </details>
    </section>
  )
}
