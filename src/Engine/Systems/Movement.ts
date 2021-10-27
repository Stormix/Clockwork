import { defineSystem, defineQuery } from 'bitecs'

import { PositionComponent } from '../Entities/Components/Position'
import { SteeringComponent } from '../Entities/Components/Steering'
import { VelocityComponent } from '../Entities/Components/Velocity'

export default function createMovementSystem() {
  const movementQuery = defineQuery([PositionComponent, VelocityComponent])

  return defineSystem((world) => {
    const entities = movementQuery(world)

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i]

      PositionComponent.x[id] +=
        VelocityComponent.x[id] + SteeringComponent.x[id]
      PositionComponent.y[id] +=
        VelocityComponent.y[id] + SteeringComponent.y[id]
    }

    return world
  })
}
