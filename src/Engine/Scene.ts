import { Container } from '@pixi/display'
import { IProcess } from './Core/IProcess'

export abstract class Scene extends Container implements IProcess {
  abstract start(): void
  abstract stop(): void
  abstract update(delta: number): void
}
