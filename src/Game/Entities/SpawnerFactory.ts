import { Level } from '../../Engine/Core/Level'
import { IObjectData } from '../../Engine/Core/Tiled/ObjectLayer'
import { Scale } from '../../Engine/Core/Utilities'
import { MonsterSpawner } from './MonsterSpawner'
import { SpawnerType } from './SpawnerType'

export default class SpawnerFactory {
  static create(
    spawnerType: SpawnerType,
    object: IObjectData,
    level: Level,
    scale: Scale,
  ) {
    switch (spawnerType) {
      case SpawnerType.MonsterSpawner:
        const spawner = new MonsterSpawner(level)

        spawner.name = object?.name ?? 'MonsterSpawner'
        spawner.x = object.x * scale.x
        spawner.y = object.y * scale.y

        return spawner
      default:
        throw new Error('Spawner type not supported')
    }
  }
}
