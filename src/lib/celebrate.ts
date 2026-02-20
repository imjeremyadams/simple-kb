import confetti from "canvas-confetti"

export function celebrate(origin: { x: number; y: number }) {
  confetti({
    particleCount: 30,
    spread: 60,
    origin,
    shapes: ["star"],
    colors: ["#fbbf24", "#f59e0b", "#fde68a", "#ffffff"],
    ticks: 100,
    gravity: 1.2,
    scalar: 1.2,
    disableForReducedMotion: true,
  })
}
