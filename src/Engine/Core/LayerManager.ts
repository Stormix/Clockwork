import { Container } from '@pixi/display'
import { Group, Layer } from '@pixi/layers'
import { Entity } from '../Entities/Entity'
import Logger from './Logger'
import { Utilities } from './Utilities'

export enum LayerType {
  Background,
  Default,
  UI,
  Debug,
}

export class LayerManager {
  private static layers: Record<number, Layer> = {}
  private constructor() {
    //
  }

  public static addToLayer(layer: LayerType, entity: Entity) {
    if (!Utilities.exists(LayerManager.layers[layer])) {
      console.error(`Layer ${layer} does not exist`)
    }
    entity.setLayer(LayerManager.layers[layer])
  }

  private static addLayer(layer: LayerType) {
    if (!Utilities.exists(LayerManager.layers[layer])) {
      LayerManager.layers[layer] = new Layer(new Group(layer, true))
    }
    return LayerManager.layers[layer]
  }

  public static initialize() {
    LayerManager.addLayer(LayerType.Default)
    LayerManager.addLayer(LayerType.UI)
    LayerManager.addLayer(LayerType.Background)
    LayerManager.addLayer(LayerType.Debug)
    Logger.info(
      'LayerManager initialized, created',
      Object.keys(LayerManager.layers).length,
      'layers',
    )
  }
  public static getLayer(layer: LayerType): Layer {
    return LayerManager.layers[layer]
  }

  public static load(container: Container) {
    for (const layer of Object.values(LayerManager.layers)) {
      container.addChild(layer)
    }
  }
}
