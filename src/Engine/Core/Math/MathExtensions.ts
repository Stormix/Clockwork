/**
 * Returns value within the range of min/max.
 * @param value The value to be clamped.
 * @param min The minimum value.
 * @param max The maximum value.
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

/**
 * Returns the provided rotation in radians.
 * @param degrees The rotation in degrees.
 */
export const degToRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180.0
}
/**
 * Returns the provided rotation in degrees.
 * @param degrees The rotation in radians.
 */
export const radToDeg = (radians: number): number => {
  return (radians * 180.0) / Math.PI
}
