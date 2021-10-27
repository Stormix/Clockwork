import { Point } from '@pixi/math'

export class Vector2 extends Point {
  constructor(x = 0, y = 0) {
    super(x, y)
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0)
  }

  public static one(): Vector2 {
    return new Vector2(1, 1)
  }

  public static subtract(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x - b.x, a.y - b.y)
  }

  public static add(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x + b.x, a.y + b.y)
  }

  public static multiply(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x * b.x, a.y * b.y)
  }

  public static divide(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x / b.x, a.y / b.y)
  }

  public static normalize(a: Vector2): Vector2 {
    const max = Math.max(Math.abs(a.x), Math.abs(a.y))
    return new Vector2(a.x / max, a.y / max)
  }

  public static scale(a: Vector2, scale: number): Vector2 {
    return new Vector2(a.x * scale, a.y * scale)
  }
}
