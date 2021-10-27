import { addEntity } from 'bitecs'
import { EntityParams } from '../../Engine/Entities/EntityFactory'
import { ClonableEntity } from '../../Engine/Entities/ClonableEntity'

export default class Monster extends ClonableEntity {
  constructor(raw: EntityParams) {
    super(raw)
  }

  update(_delta: number): void {}

  clone(): Monster {
    const eid = addEntity(this.world)
    const copy = new Monster({
      eid,
      world: this.world,
      name: this.name + ' Clone',
    })

    copy.setPosition(this.position.x, this.position.y)

    return copy
  }
}
