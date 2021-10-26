import { Mixin } from 'ts-mixer'
import { Clonable } from '../../Engine/Entities/Clonable'
import { Entity } from '../../Engine/Entities/Entity'

export abstract class ClonableEntity extends Mixin(Entity, Clonable) {
  abstract clone(): ClonableEntity
}
