import { IProcess } from '../Engine/Core/IProcess'
import Logger from '../Engine/Core/Logger'
import { Message } from '../Engine/Core/Messaging/Message'
import { Renderer } from '../Engine/Core/Renderer'
import { Engine } from '../Engine/Engine'
import { Scene } from '../Engine/Scene'
import {
  LoadingScene,
  LOADING_COMPLETE,
  LOADING_PROGRESS,
} from './Scenes/LoadingScene'

export enum Textures {
  Monster,
  Tower,
}

export class Game implements IProcess {
  private _engine: Engine
  private _scene?: Scene // Active scene
  private _loadingProgress = 0
  private _maps: string[] = []
  public textures: string[]

  onResize() {
    // this._scene?.onResize()
  }

  constructor(_engine: Engine) {
    this._engine = _engine
    this._scene = new LoadingScene(this)
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

  get loadingProgress(): number {
    return this._loadingProgress
  }

  set loadingProgress(value: number) {
    this._loadingProgress = value
    Message.send(LOADING_PROGRESS, this, value)
  }

  get maps() {
    return this._maps
  }

  load(): void {
    this._scene?.start()

    const mapCount = 12
    this._maps = [...new Array(mapCount)].map(
      (_, i) => `assets/maps/tailed/tail_${i + 1}.tmx`,
    )

    Logger.info('Loading maps...', this._maps)

    this._engine.loader.onProgress.add((loader) => {
      this.loadingProgress = loader.progress
    })

    this._engine.loader.onComplete.add(() => {
      Message.send(LOADING_COMPLETE, this, null)
    })

    this.textures = []

    this._engine.loader
      .add([...this._maps, 'assets/monsters/monster_1.animation'])
      .load()
  }

  start(): void {
    Logger.debug('Game started.')
    // Setup scene
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

  switchScene(scene: Scene) {
    this._scene?.stop()
    this._scene = scene
    this._scene.start()
  }
}
