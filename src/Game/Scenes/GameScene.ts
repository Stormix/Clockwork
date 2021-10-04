import { GameMap } from '../../Engine/GameMap'
import { Scene } from '../../Engine/Scene'
import { Game } from '../Game'
import { MonsterSpawner } from '../Entities/MonsterSpawner'
import { Entity } from '../../Engine/Entities/Entity'
import Logger from '../../Engine/Core/Logger'
import { Monster } from '../Entities/Monster'
import { Point } from '../../Engine/Core/Point'

export class GameScene extends Scene {
  private _game: Game
  private _map: GameMap
  private _gameZoneBounds = 1
  private _tileSize = 0
  private _entities: Record<string, Entity[]> = {}

  constructor(game: Game) {
    super()
    this._game = game
  }

  private calculateTileSize(mapHeight: number, mapWidth: number): number {
    const size = Math.max(mapHeight, mapWidth)
    return (this._game.height * this._gameZoneBounds) / size
  }

  get map() {
    return this._map
  }
  get tileSize() {
    return this._tileSize
  }

  get entities() {
    return this._entities
  }

  public start(): void {
    // Create random map
    const data = GameMap.createRandomMap(20)
    this._tileSize = this.calculateTileSize(data.height, data.width)

    // Generate random map
    this._map = GameMap.fromJSON(data, this._tileSize, this)

    // Add spawner
    const monsterSpawner = new MonsterSpawner(this, this._game)
    this.addSpawner(monsterSpawner)
  }

  public addMonster(m: Monster) {
    this._entities['monster'] = this._entities['monster'] ?? []
    this._entities['monster'].push(m)
  }
  public addSpawner(m: MonsterSpawner) {
    this._entities['monsterSpawner'] = this._entities['monsterSpawner'] ?? []
    this._entities['monsterSpawner'].push(m)
  }

  public stop(): void {}

  public moveMonster(monster: Monster, deltaTime: number) {
    const path = this._map.path
    const currentPos = path.findIndex(
      (pos) =>
        pos.x === monster.x / this.tileSize &&
        pos.y === monster.y / this.tileSize,
    )
    Logger.info(currentPos)
    const nextPosition = path?.[currentPos + 1] ?? this._map.end

    Logger.info(`Moving monster to: ${nextPosition.x}, ${nextPosition.y}`)

    monster.moveTo(
      new Point(nextPosition.x * this.tileSize, nextPosition.y * this.tileSize),
      deltaTime,
    )
  }

  public update(deltaTime: number): void {
    Object.keys(this._entities).forEach((entityType) => {
      switch (entityType) {
        case 'monster':
          this._entities[entityType].forEach((monster) => {
            this.moveMonster(monster as Monster, deltaTime)
            monster.update(deltaTime)
          })
          break
        case 'monsterSpawner':
          this._entities[entityType].forEach((spawner) => {
            spawner.update(deltaTime)
          })
          break
        default:
          Logger.error(`Unknown entity type: ${entityType}`)
          break
      }
    })
  }
}
