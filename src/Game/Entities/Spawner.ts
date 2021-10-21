import { Level } from '../../Engine/Core/Level'
import Logger from '../../Engine/Core/Logger'
import { Entity } from '../../Engine/Entities/Entity'
import { SpawnerType } from './SpawnerType'

export abstract class Spawner<T> extends Entity {
  private _spawnRate: number
  private _spawnCount: number
  private _spawned: number
  private _elapsedTime = 0
  private _type: SpawnerType
  private _level: Level

  constructor(
    _type: SpawnerType,
    _spawnRate: number,
    spawnCount: number,
    level: Level,
  ) {
    super()
    this._type = _type
    this._spawnRate = _spawnRate
    this._spawnCount = spawnCount
    this._spawned = 0
    this._level = level
  }

  update(deltaTime: number): void {
    if (this._spawned < this._spawnCount) {
      this._elapsedTime += deltaTime * 1000
      if (this._elapsedTime >= this._spawnRate) {
        this._elapsedTime = 0
        this._spawned++
        this.spawn()
        Logger.info(`Spawner: ${this._spawned}/${this._spawnCount}`)
      }
    }
  }

  get level(): Level {
    return this._level
  }

  abstract spawn(): T
}
