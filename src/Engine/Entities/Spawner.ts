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
  }

  spawn() {
    return this._sample.clone()
  }
}

export interface SpawnerProperties {
  EntityType: string
  SpawnerType: string
}
