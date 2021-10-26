import { Level } from '../../Engine/Core/Level'
import { TiledMap } from '../../Engine/Core/Tiled/TiledMap'
import { Game } from '../Game'
import { createWorld, IWorld, System } from 'bitecs'
import createMovementSystem from '../../Engine/Systems/Movement'
import { createSpriteSystem } from '../../Engine/Systems/Sprite'
import Logger from '../../Engine/Core/Logger'
import EntityFactory from '../../Engine/Entities/EntityFactory'
import { WaveSpawner } from '../Entities/WaveSpawner'

export class GameLevel extends Level {
  map: TiledMap
  world: IWorld

  private movementSystem: System
  private spriteSystem: System

  mapScale: {
    x: number
    y: number
  }

  constructor(game: Game, name: string, mapResource: string) {
    super(game, name)

    this.world = createWorld()

    this.setupMap(mapResource)
    this.setupEntitySystems()

    this.initialize()
  }

  initialize(): void {
    super.initialize()
    const spawner = this.entities[0] as WaveSpawner
    spawner.start()
  }

  private setupEntitySystems() {
    this.movementSystem = createMovementSystem()
    this.spriteSystem = createSpriteSystem(this, [
      'assets/textures/monsters/monster_1.png',
    ])
  }

  private setupMap(mapResource: string): void {
    this.map = new TiledMap(mapResource, this.game)
    this.map.x = 0
    this.map.y = 0

    this.mapScale = {
      x: this.game.width / this.map.width,
      y: this.game.height / this.map.height,
    }

    this.map.width = this.game.width
    this.map.height = this.game.height

    this.addChild(this.map)
    this.setupMapObjects()
  }

  private setupMapObjects(): void {
    // Entities
    for (const layerName in this.map.objectLayers) {
      switch (layerName) {
        case 'spawn':
          // This layer defines the locations of certain entities
          // Make sure to take in to consideration the scale of the map
          // as well as the size of the entity
          Logger.info(`Spawn Layer: ${layerName}`)
          const layerObjects = this.map.objectLayers[layerName].objects

          for (const object of layerObjects) {
            const entity = EntityFactory.createFromObject(object, this)
            if (entity) {
              this.addEntity(entity)
            }
          }

          break
        default:
          Logger.warn(`Unknown object layer: ${layerName}`)
          break
      }
    }
  }

  public update(delta: number): void {
    super.update(delta)

    this.entities.forEach((entity) => {
      entity.update(delta)
    })

    this.movementSystem(this.world)
    this.spriteSystem(this.world)
  }
}
