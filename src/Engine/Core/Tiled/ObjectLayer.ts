import { Container } from 'pixi.js'
import { Entity } from '../../Entities/Entity'
import EntityFactory from '../../Entities/EntityFactory'
import { Level } from '../Level'
import { Scale } from '../Utilities'
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

  public createEntities(level: Level, scale: Scale): Entity[] {
    const entities: Entity[] = []
    this.objects.forEach((object) => {
      const entity = EntityFactory.create(object, level, scale)
      if (entity) {
        entities.push(entity)
      }
    })
    return entities
  }
}
