import { addComponent, addEntity } from 'bitecs'
import { EntityParams } from '../../Engine/Entities/EntityFactory'
import { ClonableEntity } from '../../Engine/Entities/ClonableEntity'
import { Mixin } from 'ts-mixer'
import { PathFollowing } from '../../Engine/Navigation/PathFollowing'
import { SteeringComponent } from '../../Engine/Entities/Components/Steering'
import { Vector2 } from '../../Engine/Math/Vector2'
import { Path } from '../../Engine/Navigation/Path'
import { GameLevel } from '../Levels/GameLevel'
import { NavigationComponent } from '../../Engine/Entities/Components/Navigation'

export default class Monster extends Mixin(ClonableEntity, PathFollowing) {
  private _speed = 1
  private _level: GameLevel
  private _path: Path

  constructor(raw: EntityParams) {
    super(raw)
    if (!raw.level.path) {
      throw new Error('A PathFollowing entity needs a path')
    }
    this._path = raw.level.path
    addComponent(this.world, NavigationComponent, this.eid)
    addComponent(this.world, SteeringComponent, this.eid)
  }

  get path(): Path {
    return this._path
  }

  get speed(): number {
    return this._speed
  }

  set steering(value: Vector2) {
    SteeringComponent.x[this.eid] = value.x
    SteeringComponent.y[this.eid] = value.y
  }

  get steering(): Vector2 {
    return new Vector2(
      SteeringComponent.x[this.eid],
      SteeringComponent.y[this.eid],
    )
  }
  update(_delta: number): void {
    this.steering = this.pathFollowing()
  }

  clone(): Monster {
    const eid = addEntity(this.world)
    const copy = new Monster({
      eid,
      world: this.world,
      name: this.name + ' Clone',
      level: this._level,
    })

    copy.setPosition(this.position.x, this.position.y)

    return copy
  }
}
