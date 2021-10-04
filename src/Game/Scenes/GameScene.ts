import { GameMap } from '../../Engine/GameMap'
import { Scene } from '../../Engine/Scene'
import { Game } from '../Game'

export class GameScene extends Scene {
  private _game: Game
  private _map: GameMap
  private _gameZoneBounds = 1

  constructor(game: Game) {
    super()
    this._game = game
  }

  private calculateTileSize(mapHeight: number, mapWidth: number): number {
    const size = Math.max(mapHeight, mapWidth)
    return (this._game.height * this._gameZoneBounds) / size
  }

  public start(): void {
    // Create map // TODO: load from json
    const data = {
      width: 10,
      height: 10,
      data: [
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      ],
      start: { x: 0, y: 0 },
      end: { x: 9, y: 9 },
    }
    const tileSize = this.calculateTileSize(data.height, data.width)
    this._map = GameMap.fromJSON(data, tileSize, this)
  }

  public stop(): void {}

  public update(deltaTime: number): void {}
}
