import { addEntity, IWorld } from 'bitecs'
import { Level } from '../../Engine/Core/Level'
import Logger from '../../Engine/Core/Logger'
import EntityFactory from '../../Engine/Entities/EntityFactory'
import { GameLevel } from '../Levels/GameLevel'
import { ClonableEntity } from './ClonableEntity'
import Monster from './Monster'
import { Spawner, SpawnerProperties } from './Spawner'

export class WaveSpawner extends Spawner {
  private _waveSize: number
  private _waveCount: number
  private _spawnInterval: number
  private _active: boolean

  private _spawnedWaves = 0
  private _elapsedTime = 0
  private _level: Level

  constructor(raw: {
    eid: number
    world: IWorld
    name?: string
    sample: ClonableEntity
    waveSize: number
    waveCount: number
    spawnInterval: number
    level: Level
  }) {
    super(raw)
    this._waveSize = raw.waveSize
    this._waveCount = raw.waveCount
    this._spawnInterval = raw.spawnInterval / 1000
    this._level = raw.level
  }

  public start() {
    this._active = true
  }

  public update(delta: number): void {
    if (!this._active) return

    this._elapsedTime += delta

    if (
      this._elapsedTime > this._spawnInterval &&
      this._spawnedWaves < this._waveCount
    ) {
      this._elapsedTime = 0
      this._spawnedWaves++
      for (let i = 0; i < this._waveSize; i++) {
        Logger.info(`Spawning ${i} entity`)
        this._level.addEntity(this.spawn())
      }
    }

    if (this._spawnedWaves === this._waveCount) {
      this._active = false
    }
  }

  public static fromObject(
    props: WaveSpawnerProperties,
    level: GameLevel,
    entityType: string,
  ) {
    switch (entityType) {
      case 'Goblin':
        const eid = addEntity(level.world)
        return new WaveSpawner({
          eid,
          world: level.world,
          sample: EntityFactory.createEntity<Monster>(Monster, {
            world: level.world,
          }),
          waveSize: props.WaveSize,
          waveCount: props.WaveCount,
          spawnInterval: props.WaveInterval,
          level: level,
        })
      default:
        Logger.warn(`Unknown entity type: ${entityType}`)
        return null
    }
  }

  clone(): this {
    Logger.warn('WaveSpawner.clone() not implemented')
    return this
  }
}

export interface WaveSpawnerProperties extends SpawnerProperties {
  WaveCount: number
  WaveSize: number
  WaveInterval: number
}
