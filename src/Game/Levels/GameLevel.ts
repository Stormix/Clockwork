import { Level } from '../../Engine/Core/Level'
import { TiledMap } from '../../Engine/Core/Tiled/TiledMap'
import { Game } from '../Game'

export class GameLevel extends Level {
  map: TiledMap
  constructor(game: Game, name: string, mapResource: string) {
    super(game, name)

    this.map = new TiledMap(mapResource, game)
    this.map.x = 0
    this.map.y = 0
    this.map.width = game.width
    this.map.height = game.height

    this.addChild(this.map)

    this.loadEntities()
  }

  loadEntities() {
    const objectLayers = this.map.objectLayers

    Object.values(objectLayers).forEach((objectLayer) => {
      objectLayer.entities.forEach((entity) => {
        this.addEntity(entity)
      })
    })
  }
  public update(delta: number): void {
    super.update(delta)
  }
}
