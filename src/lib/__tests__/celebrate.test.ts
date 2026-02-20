import { describe, it, expect, vi } from "vitest"
import confetti from "canvas-confetti"
import { celebrate } from "../celebrate"

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}))

describe("celebrate", () => {
  it("fires star-shaped confetti at the given position", () => {
    celebrate({ x: 0.5, y: 0.3 })

    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({
        particleCount: 30,
        spread: 60,
        origin: { x: 0.5, y: 0.3 },
        shapes: ["star"],
      })
    )
  })

  it("uses gold/yellow/white colors", () => {
    celebrate({ x: 0.5, y: 0.5 })

    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({
        colors: ["#fbbf24", "#f59e0b", "#fde68a", "#ffffff"],
      })
    )
  })
})
