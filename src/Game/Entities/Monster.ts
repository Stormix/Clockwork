import { Point } from '../../Engine/Core/Point'
import { AnimatedEntity } from '../../Engine/Entities/AnimatedEntity'

export class Monster extends AnimatedEntity {
  public velocity = 250 // step per second

  constructor(animation_name: string, width?: number, height?: number) {
    super()
    const ae = AnimatedEntity.fromAnimation(animation_name)
    if (!ae) {
      throw new Error(`Animation ${animation_name} not found`)
    }
    Object.assign(this, ae)
  }

  moveTo(nextPosition: Point, deltaTime: number) {
    this.x = nextPosition.x
    this.y = nextPosition.y
  }

  update(_delta: number): void {
    super.update(_delta)
  }

  // set position(p: Point) {
  //   this._entity.x = p.x - this._entity.width / 2
  //   this._entity.y = p.y - this._entity.height / 2
  // }

  // get position(): Point {
  //   return new Point(
  //     this._entity.x + this._entity.width / 2,
  //     this._entity.y + this._entity.height / 2,
  //   )
  // }
}
