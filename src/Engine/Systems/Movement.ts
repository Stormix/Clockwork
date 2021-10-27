import { defineSystem, defineQuery } from 'bitecs'

import { PositionComponent } from '../Entities/Components/Position'
import { VelocityComponent } from '../Entities/Components/Velocity'
import { RotationComponent } from '../Entities/Components/Rotation'
import { InputComponent } from '../Entities/Components/Input'

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

      PositionComponent.x[id] += VelocityComponent.x[id]
      PositionComponent.y[id] += VelocityComponent.y[id]
    }

    return world
  })
}
