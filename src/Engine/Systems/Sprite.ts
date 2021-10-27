import { Sprite } from '@pixi/sprite'
import { defineQuery, defineSystem, enterQuery, exitQuery } from 'bitecs'
import { PositionComponent } from '../Entities/Components/Position'
import { RotationComponent } from '../Entities/Components/Rotation'
import { SizeComponent } from '../Entities/Components/Size'
import { SpriteComponent } from '../Entities/Components/Sprite'
import { Level } from '../Core/Level'
import Logger from '../Core/Logger'

export const createSpriteSystem = (scene: Level, textures: string[]) => {
  const spritesByEid = new Map<number, Sprite>()
  const spriteQuery = defineQuery([SpriteComponent])
  const spriteQueryEnter = enterQuery(spriteQuery)
  const spriteQueryExit = exitQuery(spriteQuery)

  return defineSystem((world) => {
    const entitiesEntered = spriteQueryEnter(world)

    // Create sprites for all entities with a sprite component
    for (let i = 0; i < entitiesEntered.length; ++i) {
      const eid = entitiesEntered[i]
      const texId = SpriteComponent.texture[eid]
      const texture = textures[texId]
      spritesByEid.set(eid, scene.addChild(Sprite.from(texture)))
    }

    const entities = spriteQuery(world)

    // Update sprites for all entities with a sprite component
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i]
      const sprite = spritesByEid.get(id)
      if (!sprite) {
        // log an error
        Logger.warn(`Sprite ${id} not found`)
        continue
      }

      sprite.x = PositionComponent.x[id] - SizeComponent.width[id] / 2 // Make sure the sprite is centered
      sprite.y = PositionComponent.y[id] - SizeComponent.height[id] / 2

      sprite.angle = RotationComponent.angle[id] // in degrees

      sprite.width = SizeComponent.width[id]
      sprite.height = SizeComponent.height[id]

      sprite.visible = SpriteComponent.visible[id] === 1
    }

    const entitiesExited = spriteQueryExit(world)

    for (let i = 0; i < entitiesExited.length; ++i) {
      const id = entitiesEntered[i]
      spritesByEid.delete(id)
    }

    return world
  })
}

export default createSpriteSystem
