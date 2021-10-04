import { Layer } from '@pixi/layers'
import { Sprite } from '@pixi/sprite'
import { Texture } from 'pixi.js'
import Logger from '../Core/Logger'

export abstract class Entity extends Sprite {
  constructor(texture?: Texture) {
    super(texture)
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
