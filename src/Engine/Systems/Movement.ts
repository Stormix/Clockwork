import { defineSystem, defineQuery } from 'bitecs'

import { PositionComponent } from '../components/Position'
import { VelocityComponent } from '../components/Velocity'
import { RotationComponent } from '../components/Rotation'
import { InputComponent, Direction } from '../components/Input'

export default function createMovementSystem() {
  const movementQuery = defineQuery([
    PositionComponent,
    VelocityComponent,
    InputComponent,
    RotationComponent,
  ])

  return defineSystem((world) => {
    const entities = movementQuery(world)

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i]

      const direction = InputComponent.direction[id]
      const speed = InputComponent.speed[id]

      switch (direction) {
        case Direction.None:
          VelocityComponent.x[id] = 0
          VelocityComponent.y[id] = 0
          break

        case Direction.Left:
          VelocityComponent.x[id] = -speed
          VelocityComponent.y[id] = 0
          RotationComponent.angle[id] = 180
          break

        case Direction.Right:
          VelocityComponent.x[id] = speed
          VelocityComponent.y[id] = 0
          RotationComponent.angle[id] = 0
          break

        case Direction.Up:
          VelocityComponent.x[id] = 0
          VelocityComponent.y[id] = -speed
          RotationComponent.angle[id] = 270
          break

        case Direction.Down:
          VelocityComponent.x[id] = 0
          VelocityComponent.y[id] = speed
          RotationComponent.angle[id] = 90
          break
      }

      PositionComponent.x[id] += VelocityComponent.x[id]
      PositionComponent.y[id] += VelocityComponent.y[id]
    }

    return world
  })
}
