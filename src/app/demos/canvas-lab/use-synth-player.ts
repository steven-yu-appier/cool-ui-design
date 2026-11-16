"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export const tracks = [
  {
    title: "MIDNIGHT SIGNAL",
    artist: "Canvases / night transmissions",
    root: 110,
    bpm: 96,
    duration: 40,
  },
  {
    title: "GLASS CITY",
    artist: "Canvases / soft machinery",
    root: 130.81,
    bpm: 120,
    duration: 32,
  },
  {
    title: "LAST TRAIN HOME",
    artist: "Canvases / after hours",
    root: 98,
    bpm: 80,
    duration: 48,
  },
]

function synthesize(ctx: AudioContext, track: (typeof tracks)[number]) {
  const buffer = ctx.createBuffer(
    1,
    ctx.sampleRate * track.duration,
    ctx.sampleRate
  )
  const data = buffer.getChannelData(0)
  const beat = 60 / track.bpm
  const melody = [0, 7, 12, 10, 7, 3, 5, 7, 0, 7, 15, 12, 10, 7, 5, 3]
  const progression = [0, -4, 3, -2]
  for (let i = 0; i < data.length; i++) {
    const t = i / ctx.sampleRate
    const step = Math.floor(t / (beat / 2))
    const local = t % (beat / 2)
    const chord = progression[Math.floor(t / (beat * 4)) % 4]
    const freq =
      track.root * 2 ** ((melody[step % melody.length] + chord + 12) / 12)
    const envelope = Math.min(1, local * 90) * Math.exp(-local * 9)
    const lead =
      (Math.sin(2 * Math.PI * freq * t) +
        0.2 * Math.sin(4 * Math.PI * freq * t)) *
      envelope *
      0.16
    const bass =
      Math.sin(2 * Math.PI * track.root * 2 ** (chord / 12) * t) * 0.09
    const kickTime = t % beat
    const kick =
      Math.sin(
        2 * Math.PI * (45 * kickTime + 2 * (1 - Math.exp(-kickTime * 30)))
      ) *
      Math.exp(-kickTime * 18) *
      0.18
    const fade = Math.min(1, t * 12, (track.duration - t) * 12)
    data[i] = (lead + bass + kick) * fade
  }
  return buffer
}

export function useSynthPlayer() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [volume, setVolume] = useState(0.35)
  const [error, setError] = useState("")
  const engine = useRef<{
    ctx: AudioContext
    gain: GainNode
    source: AudioBufferSourceNode | null
    start: number
    offset: number
    buffers: Map<number, AudioBuffer>
  } | null>(null)
  const track = tracks[index]

  const stop = useCallback(() => {
    const audio = engine.current
    if (!audio?.source) return
    audio.offset =
      (audio.offset + audio.ctx.currentTime - audio.start) %
      tracks[index].duration
    audio.source.stop()
    audio.source.disconnect()
    audio.source = null
  }, [index])

  useEffect(() => {
    if (!playing) return
    const audio = engine.current
    if (!audio) return
    let cancelled = false
    void audio.ctx
      .resume()
      .then(() => {
        if (cancelled) return
        let buffer = audio.buffers.get(index)
        if (!buffer) {
          buffer = synthesize(audio.ctx, tracks[index])
          audio.buffers.set(index, buffer)
        }
        const source = audio.ctx.createBufferSource()
        source.buffer = buffer
        source.loop = true
        source.connect(audio.gain)
        audio.source = source
        audio.start = audio.ctx.currentTime
        source.start(0, audio.offset)
      })
      .catch(() => {
        setError("無法啟動音訊，請再按一次播放。")
        setPlaying(false)
      })
    const timer = window.setInterval(() => {
      if (audio.source)
        setPosition(
          (audio.offset + audio.ctx.currentTime - audio.start) %
            tracks[index].duration
        )
    }, 150)
    return () => {
      cancelled = true
      clearInterval(timer)
      stop()
    }
  }, [playing, index, stop])

  useEffect(() => {
    engine.current?.gain.gain.setTargetAtTime(
      volume,
      engine.current.ctx.currentTime,
      0.02
    )
  }, [volume])
  useEffect(
    () => () => {
      void engine.current?.ctx.close()
    },
    []
  )

  function toggle() {
    if (!engine.current) {
      try {
        const ctx = new AudioContext()
        const gain = ctx.createGain()
        gain.gain.value = volume
        gain.connect(ctx.destination)
        engine.current = {
          ctx,
          gain,
          source: null,
          start: 0,
          offset: position,
          buffers: new Map(),
        }
      } catch {
        setError("此瀏覽器無法建立 Web Audio。")
        return
      }
    }
    setError("")
    setPlaying((current) => !current)
  }
  function select(next: number) {
    if (next === index) return
    stop()
    if (engine.current) engine.current.offset = 0
    setPosition(0)
    setIndex((next + tracks.length) % tracks.length)
  }
  function seek(value: number) {
    const audio = engine.current
    if (audio?.source) {
      const source = audio.ctx.createBufferSource()
      source.buffer = audio.source.buffer
      source.loop = true
      source.connect(audio.gain)
      audio.source.stop()
      audio.source.disconnect()
      audio.source = source
      audio.offset = value
      audio.start = audio.ctx.currentTime
      source.start(0, value)
    } else if (audio) audio.offset = value
    setPosition(value)
  }
  return {
    index,
    track,
    playing,
    position,
    volume,
    error,
    toggle,
    select,
    seek,
    setVolume,
  }
}
