import { IWorld } from 'bitecs'
import { ClonableEntity } from './ClonableEntity'

export abstract class Spawner extends ClonableEntity {
  private _sample: ClonableEntity

  constructor(raw: {
    eid: number
    world: IWorld
    name?: string
    sample: ClonableEntity
  }) {
    super(raw)
    this._sample = raw.sample

    this._sample.setVisibility(false)
    this._sample.setVelocity(0, 0)
    this._sample.setPosition(0, 0)
  }

  spawn() {
    return this._sample.clone()
  }
}

export interface SpawnerProperties {
  EntityType: string
  SpawnerType: string
}
