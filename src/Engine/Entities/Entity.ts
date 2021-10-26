import { addComponent, IWorld } from 'bitecs'
import { Direction, InputComponent } from '../components/Input'
import { PositionComponent } from '../components/Position'
import { RotationComponent } from '../components/Rotation'
import { SizeComponent } from '../Components/Size'
import { SpriteComponent } from '../Components/Sprite'
import { VelocityComponent } from '../components/Velocity'

export abstract class Entity {
  public name: string
  public eid: number
  public world: Readonly<IWorld>

  constructor(raw: { eid: number; world: IWorld; name?: string }) {
    this.name = raw.name ?? 'Entity'
    this.eid = raw.eid
    this.world = raw.world

    addComponent(this.world, PositionComponent, this.eid)
    addComponent(this.world, VelocityComponent, this.eid)
    addComponent(this.world, RotationComponent, this.eid)
    addComponent(this.world, SpriteComponent, this.eid)
    addComponent(this.world, SizeComponent, this.eid)
    addComponent(this.world, InputComponent, this.eid)

    PositionComponent.x[this.eid] = 0
    PositionComponent.y[this.eid] = 0

    SizeComponent.width[this.eid] = 72
    SizeComponent.height[this.eid] = 72

    InputComponent.direction[this.eid] = Direction.Right
    InputComponent.speed[this.eid] = 10
  }

  set size(value: number) {
    SizeComponent.width[this.eid] = value
    SizeComponent.height[this.eid] = value
  }

  get size() {
    return SizeComponent.width[this.eid]
  }

  setPosition(x: number, y: number) {
    PositionComponent.x[this.eid] = x
    PositionComponent.y[this.eid] = y
  }

  getPosition() {
    return {
      x: PositionComponent.x[this.eid],
      y: PositionComponent.y[this.eid],
    }
  }

  abstract update(_delta: number): void
}
