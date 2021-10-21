import { Level } from '../../Engine/Core/Level'
import Logger from '../../Engine/Core/Logger'
import { Monster } from './Monster'
import { Spawner } from './Spawner'
import { SpawnerType } from './SpawnerType'

export class MonsterSpawner extends Spawner<Monster> {
  constructor(level: Level) {
    super(SpawnerType.MonsterSpawner, 500, 100, level) // Every 1s
  }

  spawn(): Monster {
    const monster = new Monster('assets/monsters/monster_1.animation')

    monster.moveable = true
    monster.size = 96

    monster.x = this.x - monster.width / 2
    monster.y = this.y - monster.height / 2

    Logger.info(`> Spawning monster at ${this.x}, ${this.y}`)
    Logger.info(`> Spawning monster at ${monster.x}, ${monster.y}`)

    monster.setState('RUN')

    this.level.addEntity(monster)
    console.log(`Spawned monster at ${monster.x}, ${monster.y}`)

    return monster
  }

  update(delta: number): void {
    super.update(delta)
  }
}
