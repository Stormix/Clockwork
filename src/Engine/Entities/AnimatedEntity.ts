import { Layer } from '@pixi/layers'
import { AnimatedSprite, Loader, Texture } from 'pixi.js'
import Logger from '../Core/Logger'
import { IAnimation } from '../Plugins/AnimationLoader'
import { Entity } from './Entity'

export class AnimatedEntity extends Entity {
  public name: string
  private _states: Map<string, AnimatedSprite>
  private _activeState: string
  private _speed: number
  public animated = true

  constructor(
    name?: string,
    states?: Map<string, AnimatedSprite>,
    speed?: number,
  ) {
    super()
    this.name = name ?? 'AnimatedEntity'
    this._states = states ?? new Map<string, AnimatedSprite>()
    this.speed = speed ?? 0.4
  }

  getState(state_name: string): AnimatedSprite | null {
    if (this._states.has(state_name)) {
      return this._states.get(state_name)!
    }
    return null
  }

  setState(state_name: string) {
    if (this._states.has(state_name)) {
      this._states.forEach((state) => {
        state.visible = false
      })
      this._states.get(state_name)!.visible = true
      this._activeState = state_name
      this.play()
    } else {
      Logger.error(`State ${state_name} does not exist`)
    }
  }

  get states() {
    return this._states
  }

  set states(states: Map<string, AnimatedSprite>) {
    this._states = states
  }

  setLayer(layer: Layer) {
    if (!layer) {
      Logger.warn('Entity.setLayer: layer is null')
      return
    }
    this.parentLayer = layer
    this.parentGroup = layer.group
    layer.addChild(this)
  }

  static fromAnimation(animation_name: string) {
    const resources = Loader.shared.resources
    if (!resources[animation_name]) {
      Logger.warn(
        `AnimatedEntity.fromAnimation: animation ${animation_name} not found`,
      )
      return null
    }

    const animation: IAnimation = resources[animation_name].data

    const states = new Map<string, AnimatedSprite>()

    for (const state of animation.states) {
      const textures = []
      for (const frame of state.frames) {
        textures.push(Texture.from(frame))
      }
      const sprite = new AnimatedSprite(textures)
      sprite.name = `${animation.name}_${state.name}`
      sprite.visible = false

      states.set(state.name, sprite)
    }

    const entity = new AnimatedEntity(animation.name, states)
    for (const state of animation.states) {
      entity.addChild(entity._states.get(state.name)!)
    }
    return entity
  }

  play() {
    if (this._activeState && this._states.has(this._activeState)) {
      this._states.get(this._activeState)?.play()
    }
  }
  update(_delta: number): void {
    // TODO: implement
  }

  get speed() {
    return this._speed
  }

  set speed(speed: number) {
    this._speed = speed
    this._states.forEach((state) => {
      state.animationSpeed = speed
    })
  }

  get width() {
    return this._width
  }

  set width(width: number) {
    this._width = width
    this._states.forEach((state) => {
      state.width = width
    })
  }

  get height() {
    return this._height
  }

  set height(height: number) {
    this._height = height
    this._states.forEach((state) => {
      state.height = height
    })
  }

  set size(size: number) {
    console.log(size)
    this.width = size
    this.height = size
    console.log(this.width, this.height)
  }
}
