import { Mixin } from 'ts-mixer'
import { Clonable } from './Traits/Clonable'
import { Entity } from './Entity'

export abstract class ClonableEntity extends Mixin(Entity, Clonable) {
  abstract clone(): ClonableEntity
}
