import Logger from '../../Engine/Core/Logger'
import { Game } from '../Game'
import { GameScene } from '../Scenes/GameScene'
import { Monster } from './Monster'
import { Spawner } from './Spawner'

export class MonsterSpawner extends Spawner<Monster> {
  private _scene: GameScene
  private _game: Game

  constructor(scene: GameScene, game: Game) {
    super(1000, 1) // Every 1s
    this._scene = scene
    this._game = game

    const start = scene.map.start

    this.x = start.x
    this.y = start.y
  }

  spawn(): Monster {
    const monster = new Monster()
    const nextStep = this._scene.map.path[1]

    Logger.info(`Spawning monster at ${nextStep.x}, ${nextStep.y}`)

    monster.x = nextStep.x * this._scene.tileSize
    monster.y = nextStep.y * this._scene.tileSize

    monster.width = this._scene.tileSize
    monster.height = this._scene.tileSize

    this._scene.addChild(monster)
    this._scene.addMonster(monster)
    return monster
  }
}
