import { addEntity, IWorld } from 'bitecs'
import { SpawnerProperties } from '../../Game/Entities/Spawner'
import {
  WaveSpawner,
  WaveSpawnerProperties,
} from '../../Game/Entities/WaveSpawner'
import { GameLevel } from '../../Game/Levels/GameLevel'
import Logger from '../Core/Logger'
import { IObjectData } from '../Core/Tiled/ObjectLayer'
import { Entity } from './Entity'

export interface EntityParams {
  eid: number
  world: IWorld
  [key: string]: any
}

export default class EntityFactory {
  private constructor() {}

  public static createEntity<K extends Entity>(
    ctor: { new (params: EntityParams): K },
    data: {
      world: IWorld
    } & Record<string, any>,
  ): K {
    if (!data.world) {
      throw new Error('EntityFactory: world is required')
    }
    const eid = addEntity(data.world)
    return new ctor({
      eid,
      ...data,
    })
  }

  public static createSpawner(
    object: IObjectData,
    gameLevel: GameLevel,
  ): Entity | null {
    if (!object?.properties) {
      Logger.error('Spawner: spawnerPropetier is required')
      return null
    }

    const { EntityType, SpawnerType } = object.properties as SpawnerProperties

    switch (SpawnerType) {
      case 'WaveSpawner':
        const { WaveCount, WaveSize, WaveInterval } =
          object.properties as WaveSpawnerProperties

        return WaveSpawner.fromObject(
          object.properties as WaveSpawnerProperties,
          gameLevel,
          EntityType,
        )

      default:
        Logger.error(`Spawner: ${SpawnerType} is not supported`)
        return null
    }
    return null
  }

  public static createFromObject<T extends Entity>(
    object: IObjectData,
    gameLevel: GameLevel,
  ): T | null {
    switch (object.type) {
      case 'Spawner': {
        return EntityFactory.createSpawner(object, gameLevel) as T
      }
      default:
        Logger.warn(`EntityFactory: Unknown entity type ${object.type}`)
        return null
    }
  }
}
