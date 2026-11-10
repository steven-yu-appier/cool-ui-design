"use client"

import { Slider } from "@base-ui/react/slider"

type PlayerSliderProps = {
  label: string
  value: number
  max: number
  step: number
  onValueChange: (value: number) => void
  disabled?: boolean
}

export function PlayerSlider({
  label,
  value,
  max,
  step,
  onValueChange,
  disabled,
}: PlayerSliderProps) {
  return (
    <Slider.Root
      className="player-slider"
      value={value}
      min={0}
      max={max}
      step={step}
      largeStep={max / 10}
      onValueChange={onValueChange}
      disabled={disabled}
      thumbAlignment="edge"
    >
      <Slider.Control className="slider-control">
        <Slider.Track className="slider-track">
          <Slider.Indicator className="slider-indicator" />
          <Slider.Thumb className="slider-thumb" aria-label={label} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}
