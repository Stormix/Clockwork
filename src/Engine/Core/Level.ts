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

  private initialize() {
    Logger.info('Initializing level: ', this._name)
  }

  public addEntity(entity: Entity) {
    this._entites.push(entity)
    this.addChild(entity)
  }

  public removeEntity(entity: Entity) {
    this._entites = this._entites.filter((e) => e !== entity)
    this.removeChild(entity)
  }

  public load() {
    this.initialize()
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
