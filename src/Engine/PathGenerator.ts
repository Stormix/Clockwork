import { Point } from './Core/Point'
import { GameMap } from './GameMap'

export type Path = Direction[]

enum Direction {
  Down,
  Left,
  Right,
}

export class PathGenerator {
  _visited: Map<Point, boolean>
  path: Path | null = []

  constructor() {}

  getNewDirection(allowed: Direction) {
    // Get a new random allowed direction
    let newDirection: Direction
    const maxD = Object.keys(Direction).length / 2
    do {
      newDirection = Math.floor(Math.random() * maxD) as Direction
    } while ((newDirection & allowed) === 0)

    return newDirection
  }

  public generate<T>(map: GameMap<T>, start: Point, end: Point, prob = 0.5): Path {
    const newPath = [] as Path
    const currentPoint = start.clone()
    let currentDirection = Direction.Right as Direction
    let newDirection = currentDirection

    while (!currentPoint.equals(end)) {
      if (Math.random() < prob) {
        // Let's generate a turn
        do {
          if (currentPoint.x === end.x) {
            newDirection = this.getNewDirection(Direction.Down | Direction.Left)
          } else if (currentPoint.y === end.y) {
            newDirection = Direction.Right
          } else if (currentPoint.x <= 0) {
            newDirection = this.getNewDirection(
              Direction.Right | Direction.Down,
            )
          } else {
            newDirection = this.getNewDirection(
              Direction.Left | Direction.Right | Direction.Down,
            )
          }
        } while (
          (newDirection | currentDirection) ===
          (Direction.Right | Direction.Left)
        )
        newPath.push(newDirection)

        currentDirection = newDirection

        switch (newDirection) {
          case Direction.Down:
            currentPoint.y++
            break
          case Direction.Left:
            currentPoint.x--
            break
          case Direction.Right:
            currentPoint.x++
            break
        }
      }
    }

    return newPath
  }
}
