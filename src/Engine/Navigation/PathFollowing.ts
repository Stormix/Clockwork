import { Point } from '@pixi/math'
import { Vector2 } from '../Math/Vector2'
import { Path } from './Path'

export abstract class PathFollowing {
  public currentNode: number

  constructor() {
    this.currentNode = 0
  }

  abstract get path(): Path
  abstract get speed(): number
  abstract get position(): Point

  private seek(target: Point) {
    const desired = Vector2.subtract(target, this.position)
    const d = Vector2.normalize(desired)
    return Vector2.scale(d, this.speed)
  }

  public pathFollowing() {
    let target: Point | null = null

    if (this.path) {
      const nodes = this.path.points
      target = nodes[this.currentNode]

      if (distance(this.position, target) < this.speed) {
        this.currentNode++
        if (this.currentNode >= nodes.length) {
          this.currentNode = nodes.length - 1
        }
      }
    }

    return target ? this.seek(target) : Vector2.zero()
  }
}

export const distance = (p1: Point, p2: Point) => {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y),
  )
}
