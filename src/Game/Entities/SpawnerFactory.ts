import { IObjectData } from '../../Engine/Core/Tiled/ObjectLayer'
import { MonsterSpawner } from './MonsterSpawner'
import { SpawnerType } from './SpawnerType'

export default class SpawnerFactory {
  static create(spawnerType: SpawnerType, object: IObjectData) {
    switch (spawnerType) {
      case SpawnerType.MonsterSpawner:
        const spawner = new MonsterSpawner()

        spawner.name = object?.name ?? 'MonsterSpawner'
        spawner.x = object.x
        spawner.y = object.y

        return spawner
      default:
        throw new Error('Spawner type not supported')
    }
  }
}
