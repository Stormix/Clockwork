import { Level } from '../../Engine/Core/Level'
import { TiledMap } from '../../Engine/Core/Tiled/TiledMap'
import { Monster } from '../Entities/Monster'
import { Game } from '../Game'

export class GameLevel extends Level {
  map: TiledMap

  mapOriginalSize: {
    width: number
    height: number
  }

  originalScale: {
    x: number
    y: number
  }

  constructor(game: Game, name: string, mapResource: string) {
    super(game, name)

    this.map = new TiledMap(mapResource, game)
    this.map.x = 0
    this.map.y = 0

    this.mapOriginalSize = {
      width: this.map.width,
      height: this.map.height,
    }

    this.originalScale = {
      x: game.width / this.map.width,
      y: game.height / this.map.height,
    }

    this.map.width = game.width
    this.map.height = game.height

    this.addChild(this.map)

    this.loadEntities()
  }

  loadEntities() {
    const objectLayers = this.map.objectLayers

    Object.values(objectLayers).forEach((objectLayer) => {
      objectLayer.createEntities(this, this.originalScale).forEach((entity) => {
        this.addEntity(entity)
      })
    })
  }

  public update(delta: number): void {
    super.update(delta)
    this.entities.forEach((entity) => {
      if (entity.animated) {
        entity.x =
          (entity.x + (entity as Monster).velocity * delta) % this.map.width
      }
    })
  }
}
