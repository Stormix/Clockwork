import { Container } from '@pixi/display'
import { Entity } from '../Entities/Entity'
import { Game } from '../../Game/Game'
import { LayerManager } from './LayerManager'
import Logger from './Logger'

export class Level extends Container {
  private _entites: Entity[] = []
  private _game: Game
  private _name: string

  constructor(game: Game) {
    super()
    this._game = game
    this._name = 'level0'
  }

  private initialize() {
    Logger.info('Initializing level: ', this._name)
  }

  public load() {
    this.initialize()
    LayerManager.load(this)

    this._entites.forEach((entity) => {
      this.addChild(entity)
    })
  }

  public unload() {
    this._entites.forEach((entity) => {
      this.removeChild(entity)
    })
  }

  public update(delta: number) {
    this._entites.forEach((entity) => {
      entity.update(delta)
    })
  }
}
