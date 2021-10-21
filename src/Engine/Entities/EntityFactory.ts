import SpawnerFactory from '../../Game/Entities/SpawnerFactory'
import { Level } from '../Core/Level'
import Logger from '../Core/Logger'
import { IObjectData } from '../Core/Tiled/ObjectLayer'
import { Scale } from '../Core/Utilities'
import { Entity } from './Entity'
import { EntityType } from './EntityType'

export default class EntityFactory {
  private constructor() {}

  public static create(
    object: IObjectData,
    level: Level,
    scale: Scale,
  ): Entity {
    Logger.info(`Creating entity: ${object.name} of type: ${object.type}`)
    switch (object.type) {
      case EntityType.Spawner:
        return SpawnerFactory.create(
          object.properties?.SpawnerType,
          object,
          level,
          scale,
        )

      default:
        throw new Error('Entity type not supported')
    }
  }
}
