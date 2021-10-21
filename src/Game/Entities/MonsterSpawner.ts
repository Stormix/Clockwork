import { Monster } from './Monster'
import { Spawner } from './Spawner'
import { SpawnerType } from './SpawnerType'

export class MonsterSpawner extends Spawner<Monster> {
  constructor() {
    super(SpawnerType.MonsterSpawner, 1000, 1) // Every 1s

    // const start = scene.map.start

    // this.x = start.x
    // this.y = start.y
  }

  spawn(): Monster {
    const monster = new Monster()
    // const nextStep = this._scene.map.path[1]

    // Logger.info(`Spawning monster at ${nextStep.x}, ${nextStep.y}`)

    // monster.x = nextStep.x * this._scene.tileSize
    // monster.y = nextStep.y * this._scene.tileSize

    // monster.width = this._scene.tileSize
    // monster.height = this._scene.tileSize

    return monster
  }

  update(delta: number): void {
    // super.update(delta)
    // Pass
    // Logger.info('MonsterSpawner.update()')
  }
}
