export class TMath {
  public static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  public static radToDeg(radians: number): number {
    return radians * (180 / Math.PI)
  }

  public static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }
}
