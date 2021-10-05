import { Container, Graphics, Loader } from 'pixi.js'
import ImageLayer from './ImageLayer'
import TileLayer from './TileLayer'
import TileSet from './TileSet'
import path from 'path'
import { Game } from '../../../Game/Game'

export class TiledMap extends Container {
  public resourceUrl: string
  public tileSets: TileSet[] = []
  public layers: { [index: string]: TileLayer } = {}
  public background = new Graphics()
  public tileWidth = 0
  public tileHeight = 0
  public game: Game

  constructor(resourceUrl: string, game: Game) {
    super()
    this.resourceUrl = resourceUrl
    this.game = game
    this.create()
  }

  public create() {
    const route = path.dirname(Loader.shared.resources[this.resourceUrl].url)
    const data: ITMXData = Loader.shared.resources[this.resourceUrl].data

    this.background.beginFill(0x000000, 1)
    this.background.drawRect(0, 0, this.game.width, this.game.height)
    console.log(0, 0, this.game.width, this.game.height)
    this.background.endFill()
    this.addChild(this.background)

    data.tileSets.forEach((tileSet) => {
      this.tileSets.push(new TileSet(route, tileSet))
    })

    data.layers.forEach((layerData) => {
      switch (layerData.type) {
        case 'tile': {
          const tileLayer = new TileLayer(layerData, this.tileSets, this)
          this.layers[layerData.name] = tileLayer
          this.addChild(tileLayer)
          break
        }
        case 'image': {
          const imageLayer = new ImageLayer(layerData, route)
          this.layers[layerData.name] = imageLayer as TileLayer
          this.addChild(imageLayer)
          break
        }
      }
    })
  }
}
