export class Point {
  private _x: number
  private _y: number

  constructor(x = 0, y = 0) {
    this._x = x
    this._y = y
  }

  public get x(): number {
    return this._x
  }

  public set x(value: number) {
    this._x = value
  }

  public get y(): number {
    return this._y
  }

  public set y(value: number) {
    this._y = value
  }

  public add(point: Point): Point {
    return new Point(this._x + point.x, this._y + point.y)
  }

  public clone(): Point {
    return new Point(this._x, this._y)
  }

  public equals(p: Point): boolean {
    return this._x === p._x && this._y === p._y
  }

  public static distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  public static fromIndex(index: number, width: number): Point {
    return new Point(index % width, Math.floor(index / width))
  }

  public toIndex(width: number): number {
    return this.y * width + this.x
  }
}
