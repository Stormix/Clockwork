import { Layer } from '@pixi/layers'
import { Sprite } from '@pixi/sprite'
import { Texture } from 'pixi.js'
import Logger from '../Core/Logger'

export abstract class Entity extends Sprite {
  public name: string
  public moveable = false
  public animated = false

  constructor(texture?: Texture, name?: string) {
    super(texture)
    this.name = name || 'Entity'
  }

  abstract update(_delta: number): void

  setLayer(layer: Layer) {
    if (!layer) {
      Logger.warn('Entity.setLayer: layer is null')
      return
    }
    this.parentLayer = layer
    this.parentGroup = layer.group
    layer.addChild(this)
  }
}
