import { EntityParams } from '../../Engine/Entities/EntityFactory'
import Monster from './Monster'

export class Goblin extends Monster {
  constructor(params: EntityParams) {
    super(params)
  }
}
