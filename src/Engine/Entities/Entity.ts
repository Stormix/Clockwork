import {
  addComponent,
  Component,
  getEntityComponents,
  hasComponent,
  IWorld,
} from 'bitecs'
import { InputComponent } from './Components/Input'
import { PositionComponent } from './Components/Position'
import { RotationComponent } from './Components/Rotation'
import { SizeComponent } from './Components/Size'
import { SpriteComponent } from './Components/Sprite'
import { VelocityComponent } from './Components/Velocity'

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

    // Set some defaults
    this.setSize(72)
    this.setPosition(0, 0)
    this.setRotation(0)
    this.setVelocity(0, 0)
    this.setVisibility(true)
  }

  hasComponent(component: Component) {
    return hasComponent(this.world, component, this.eid)
  }

  components() {
    return getEntityComponents(this.world, this.eid)
  }

  hide() {
    SpriteComponent.visible[this.eid] = 0
  }

  setVisibility(value: boolean) {
    SpriteComponent.visible[this.eid] = value ? 1 : 0
  }

  setSize(value: number) {
    SizeComponent.width[this.eid] = value
    SizeComponent.height[this.eid] = value
  }

  setPosition(x: number, y: number) {
    PositionComponent.x[this.eid] = x
    PositionComponent.y[this.eid] = y
  }

  setVelocity(x: number, y: number) {
    VelocityComponent.x[this.eid] = x
    VelocityComponent.y[this.eid] = y
  }

  setRotation(value: number) {
    RotationComponent.angle[this.eid] = value
  }

  get velocity() {
    return {
      x: VelocityComponent.x[this.eid],
      y: VelocityComponent.y[this.eid],
    }
  }

  get rotation() {
    return RotationComponent.angle[this.eid]
  }

  get position() {
    return {
      x: PositionComponent.x[this.eid],
      y: PositionComponent.y[this.eid],
    }
  }

  get size() {
    return {
      width: SizeComponent.width[this.eid],
      height: SizeComponent.height[this.eid],
    }
  }
  abstract update(_delta: number): void
}
