import { Container } from 'pixi.js'
import { GameLevel } from '../../../Game/Levels/GameLevel'
import { Entity } from '../../Entities/Entity'
import EntityFactory from '../../Entities/EntityFactory'
import { Scale } from '../../Core/Utilities'
export interface IObjectData {
  name: string
  type: string
  x: number
  y: number
  properties?: Record<string, any>
}
export default class ObjectLayer extends Container {
  public layer: ILayerData
  public objects: IObjectData[]

  constructor(layer: ILayerData) {
    super()
    this.layer = layer
    Object.assign(this, layer)
  }

  public createEntities(level: GameLevel, scale: Scale): Entity[] {
    const entities: Entity[] = []
    this.objects.forEach((object) => {
      const entity = EntityFactory.createFromObject(object, level)
      if (entity) {
        entities.push(entity)
      }
    })
    return entities
  }
}
