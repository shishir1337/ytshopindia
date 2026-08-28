"use client"

import * as React from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

const format = (num: number, decimals: number) =>
  decimals > 0 ? num.toFixed(decimals) : Math.floor(num).toString()

export function AnimatedCounter({
  value,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const numberRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const node = numberRef.current
    if (!node) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = format(value, decimals)
      return
    }

    let frame = 0
    let startTime: number | null = null

    const step = (now: number) => {
      if (startTime === null) startTime = now
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)

      // Written straight to the DOM. Driving this through React state meant one
      // re-render of the whole subtree per frame while the page was still
      // loading, which showed up directly as blocking time.
      node.textContent = format(value * eased, decimals)

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        node.textContent = format(0, decimals)
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.1 }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [value, duration, decimals])

  return (
    <span className={className}>
      {prefix}
      {/* Rendered with the final value so the server HTML - and anyone without
          JavaScript - shows the real number rather than a zero. */}
      <span ref={numberRef}>{format(value, decimals)}</span>
      {suffix}
    </span>
  )
}
