import { Scene } from '../../Engine/Scene'
import { Game } from '../Game'
import { Level } from '../../Engine/Core/Level'
import { GameLevel } from '../Levels/GameLevel'
import Logger from '../../Engine/Core/Logger'

export class GameScene extends Scene {
  private _game: Game
  private _level: Level

  constructor(game: Game) {
    super()
    this._game = game

    this.visible = false
  }

  public start(): void {
    super.start()
    // Load a random map for now, we'll add difficulty later
    // const randomMap = Utilities.randomChoice<string>(this._game.maps)
    const randomMap = this._game.maps[1]
    const levelName = `${randomMap}`
    Logger.info(`Loading level: ${levelName}`)
    this.loadLevel(new GameLevel(this._game, levelName, randomMap))
    Logger.info(this._level)
  }

  loadLevel(level: GameLevel) {
    this._level = level
    this.addChild(this._level)
  }

  public stop(): void {
    super.stop()
  }

  public update(deltaTime: number): void {
    this._level.update(deltaTime)
  }
}
