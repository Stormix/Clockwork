import { Graphics } from '@pixi/graphics'
import { Point } from '@pixi/math'
import { IPolygonData } from '../Plugins/Tiled/ObjectLayer'

export class Path {
  public points: Point[]
  constructor(points?: Point[]) {
    this.points = points ?? []
  }

  public static fromObject(
    obj: IPolygonData,
    scale: {
      x: number
      y: number
    },
    mapSize: {
      width: number
      height: number
    },
  ): Path | null {
    try {
      const points = []

      for (let i = 0; i < obj.polygon.length; i++) {
        const p = obj.polygon[i]
        const x = p.x * scale.x + obj.x * scale.x
        const y = p.y * scale.y + obj.y * scale.y

        if (!isOutOfBounds(x, y, mapSize.width, mapSize.height)) {
          points.push(new Point(x, y))
        }
      }
      return new Path(points)
    } catch (error) {
      return null
    }
  }

  toGraphics(): Graphics {
    const g = new Graphics()
    g.lineStyle(1, 0xffffff)
    g.beginFill(0xffffff)

    for (let i = 0; i < this.points.length - 1; i++) {
      const currentPoint = this.points[i]
      const nextPoint = this.points[i + 1]

      g.moveTo(currentPoint.x, currentPoint.y)
      g.lineTo(nextPoint.x, nextPoint.y)
    }

    g.endFill()

    return g
  }

  get length(): number {
    return this.points.length
  }
}

export const isOutOfBounds = (
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number,
) => {
  return x < 0 || y < 0 || x > mapWidth || y > mapHeight
}
