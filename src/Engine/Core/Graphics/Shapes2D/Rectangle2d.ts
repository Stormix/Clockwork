﻿import { Vector2 } from '../../Math/'
import { Circle2D } from './'
import { IShape2D } from './'

/** Represents a 2D rectangle. */
export class Rectangle2D implements IShape2D {
  /** The position of this shape. */
  public position: Vector2 = Vector2.zero

  /** The origin of this shape. */
  public origin: Vector2 = Vector2.zero

  /** The width of this shape. */
  public width: number

  /** The height of this shape. */
  public height: number

  /**
   * Creates a new rectangle.
   * @param x The x position of this shape.
   * @param y The y position of this shape.
   * @param width The width of this shape.
   * @param height The height of this shape.
   */
  public constructor(x = 0, y = 0, width = 0, height = 0) {
    this.position.x = x
    this.position.y = y
    this.width = width
    this.height = height
  }

  /** The offset of this shape. */
  public get offset(): Vector2 {
    return new Vector2(this.width * this.origin.x, this.height * this.origin.y)
  }

  /**
   * Sets the properties of this shape from the provided json.
   * @param json The json to set from.
   */
  public setFromJson(json: any): void {
    if (json.position) {
      this.position.setFromJson(json.position)
    }

    if (json.origin) {
      this.origin.setFromJson(json.origin)
    }

    if (!json?.width) {
      throw new Error('Rectangle2D requires width to be present.')
    }
    this.width = Number(json.width)

    if (!json?.height) {
      throw new Error('Rectangle2D requires height to be present.')
    }
    this.height = Number(json.height)
  }

  /**
   * Indicates if this shape intersects the other shape.
   * @param other The other shape to check.
   */
  public intersects(other: IShape2D): boolean {
    if (other instanceof Rectangle2D) {
      const a = this.getExtents(this)
      const b = this.getExtents(other)

      return (
        a.position.x <= b.width &&
        a.width >= b.position.x &&
        a.position.y <= b.height &&
        a.height >= b.position.y
      )
    }

    if (other instanceof Circle2D) {
      const deltaX =
        other.position.x -
        Math.max(
          this.position.x,
          Math.min(other.position.x, this.position.x + this.width),
        )
      const deltaY =
        other.position.y -
        Math.max(
          this.position.y,
          Math.min(other.position.y, this.position.y + this.height),
        )
      if (deltaX * deltaX + deltaY * deltaY < other.radius * other.radius) {
        return true
      }
    }

    return false
  }

  /**
   * Indicates if the provided point is contained within this shape.
   * @param point The point to check.
   */
  public pointInShape(point: Vector2): boolean {
    const x = this.width < 0 ? this.position.x - this.width : this.position.x
    const y = this.height < 0 ? this.position.y - this.height : this.position.y

    const extentX =
      this.width < 0 ? this.position.x : this.position.x + this.width
    const extentY =
      this.height < 0 ? this.position.y : this.position.y + this.height

    if (
      point.x >= x &&
      point.x <= extentX &&
      point.y >= y &&
      point.y <= extentY
    ) {
      return true
    }

    return false
  }

  private getExtents(shape: Rectangle2D): Rectangle2D {
    const x =
      shape.width < 0 ? shape.position.x - shape.width : shape.position.x
    const y =
      shape.height < 0 ? shape.position.y - shape.height : shape.position.y

    const extentX =
      shape.width < 0 ? shape.position.x : shape.position.x + shape.width
    const extentY =
      shape.height < 0 ? shape.position.y : shape.position.y + shape.height

    return new Rectangle2D(x, y, extentX, extentY)
  }
}
