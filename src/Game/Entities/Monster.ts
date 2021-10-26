import { addEntity, IWorld } from 'bitecs'
import { ClonableEntity } from './ClonableEntity'

export default class Monster extends ClonableEntity {
  public velocity = 250 // step per second

  constructor(raw: { eid: number; world: IWorld; name?: string }) {
    super(raw)
  }

  update(_delta: number): void {}

  clone(): Monster {
    const eid = addEntity(this.world)
    return new Monster({
      eid,
      world: this.world,
      name: this.name + ' Clone',
    })
  }
}
