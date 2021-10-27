import { addEntity, IWorld } from 'bitecs'
import { Level } from '../Core/Level'
import Logger from '../Core/Logger'
import { IObjectData } from '../Plugins/Tiled/ObjectLayer'
import EntityFactory from './EntityFactory'
import { GameLevel } from '../../Game/Levels/GameLevel'
import { ClonableEntity } from './ClonableEntity'
import Monster from '../../Game/Entities/Monster'
import { Spawner, SpawnerProperties } from '../../Engine/Entities/Spawner'

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
        const entity = this.spawn()
        entity.setPosition(
          this.position.x + Math.random() * 50,
          this.position.y - 20 * i * 0.2,
        )
        this._level.addEntity(entity)
      }
    }

    if (this._spawnedWaves === this._waveCount) {
      this._active = false
    }
  }

  public static fromObject(
    object: IObjectData,
    level: GameLevel,
    entityType: string,
  ) {
    switch (entityType) {
      case 'Goblin':
        const props = object.properties as WaveSpawnerProperties
        const eid = addEntity(level.world)
        const sample = EntityFactory.createEntity<Monster>(Monster, {
          world: level.world,
          path: level.path,
        })

        const { x: _x, y: _y } = object
        const { x, y } = level.toWorldCoordinates(_x, _y)

        sample.hide() // The parent entity shouldn't be visible

        const spawner = new WaveSpawner({
          eid,
          world: level.world,
          sample,
          waveSize: props.WaveSize,
          waveCount: props.WaveCount,
          spawnInterval: props.WaveInterval,
          level: level,
        })

        spawner.setPosition(x, y)
        spawner.start()

        return spawner

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
