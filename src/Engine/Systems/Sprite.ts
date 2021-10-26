import { Sprite } from '@pixi/sprite'
import { defineQuery, defineSystem, enterQuery, exitQuery } from 'bitecs'
import { PositionComponent } from '../Components/Position'
import { RotationComponent } from '../Components/Rotation'
import { SizeComponent } from '../Components/Size'
import { SpriteComponent } from '../Components/Sprite'
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
      console.log(`Creating sprite for entity #${eid}`, texture)
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

      sprite.x = PositionComponent.x[id]
      sprite.y = PositionComponent.y[id]
      sprite.angle = RotationComponent.angle[id] // in degrees

      sprite.width = SizeComponent.width[id]
      sprite.height = SizeComponent.height[id]
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
