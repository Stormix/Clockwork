import { SceneGraph } from '../'
import { BaseCamera } from './'

export class PerspectiveCamera extends BaseCamera {
  public constructor(name: string, sceneGraph?: SceneGraph) {
    super(name, sceneGraph)
  }
}
