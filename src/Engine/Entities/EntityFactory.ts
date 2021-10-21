import SpawnerFactory from '../../Game/Entities/SpawnerFactory'
import Logger from '../Core/Logger'
import { IObjectData } from '../Core/Tiled/ObjectLayer'
import { Entity } from './Entity'
import { EntityType } from './EntityType'

export default class EntityFactory {
  private constructor() {}

  public static create(object: IObjectData): Entity {
    Logger.info(`Creating entity: ${object.name} of type: ${object.type}`)
    switch (object.type) {
      case EntityType.Spawner:
        return SpawnerFactory.create(object.properties?.SpawnerType, object)

      default:
        throw new Error('Entity type not supported')
    }
  }
}
