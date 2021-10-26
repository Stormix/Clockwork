import { IWorld } from 'bitecs'
import { Entity } from '../../Engine/Entities/Entity'

export class Tower extends Entity {
  constructor(raw: { eid: number; world: IWorld; name?: string }) {
    super(raw)
  }

  update(_delta: number): void {}
}
