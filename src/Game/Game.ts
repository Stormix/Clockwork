import { IProcess } from '../Engine/Core/IProcess'
import { LayerManager } from '../Engine/Core/LayerManager'
import Logger from '../Engine/Core/Logger'
import { Renderer } from '../Engine/Core/Renderer'
import { Engine } from '../Engine/Engine'
import { Scene } from '../Engine/Scene'
import { GameScene } from './Scenes/GameScene'

export class Game implements IProcess {
  private _engine: Engine
  private _scene?: Scene // Active scene

  constructor(_engine: Engine) {
    this._engine = _engine
  }

  get scene(): Scene {
    return this._scene as Scene // There's always a scene at this point
  }

  get engine(): Engine {
    return this._engine
  }

  get width(): number {
    return this._engine.width
  }

  get height(): number {
    return this._engine.height
  }

  start(): void {
    Logger.debug('Game started.')
    // Setup layers
    LayerManager.initialize()

    // Setup scene
    this._scene = new GameScene(this) // TODO: remove this class and load instead from file
    LayerManager.load(this._scene)
    this._scene.start()
  }

  stop(): void {
    Logger.debug('Game ended.')
    delete this._scene
  }

  update(delta: number): void {
    if (!this._scene) return
    this._scene.update(delta)
  }

  render(_renderer: Renderer) {
    if (!this._scene) return
    _renderer.render(this._scene)
  }
}
