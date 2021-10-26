import { Container } from '@pixi/display'
import { Entity } from '../Entities/Entity'
import { Game } from '../../Game/Game'
import Logger from './Logger'

export class Level extends Container {
  private _entites: Entity[] = []
  private _game: Game
  private _name: string

  constructor(game: Game, name: string) {
    super()
    this._game = game
    this._name = name
  }

  get game(): Game {
    return this._game
  }

  get entities(): Entity[] {
    return this._entites
  }

  initialize() {
    Logger.info('Initializing level: ', this._name)
  }

  addEntity(entity: Entity) {
    this._entites.push(entity)
  }

  removeEntity(entity: Entity) {
    this._entites.splice(this._entites.indexOf(entity), 1)
  }

  public update(delta: number) {}
}
