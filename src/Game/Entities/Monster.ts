import { Texture } from '@pixi/core'
import { Point } from '../../Engine/Core/Point'
import { Entity } from '../../Engine/Entities/Entity'

export class Monster extends Entity {
  public velocity = 0.5 // step per second

  moveTo(nextPosition: Point, deltaTime: number) {
    this.x = nextPosition.x
    this.y = nextPosition.y
  }

  constructor() {
    super(Texture.from('assets/textures/monster.png'))
  }

  update(_delta: number): void {
    // TODO: move along the path
  }
}
