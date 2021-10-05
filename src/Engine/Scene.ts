import { Container } from '@pixi/display'
import { IProcess } from './Core/IProcess'

export abstract class Scene extends Container implements IProcess {
  constructor() {
    super()
    this.visible = false
  }
  start() {
    this.visible = true
  }
  stop() {
    this.visible = false
  }
  abstract update(delta: number): void
}
