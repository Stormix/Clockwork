import { Texture } from 'pixi.js'

export default class TileSet {
  public firstGid = 0
  public baseTexture: Texture
  public margin = 0
  public spacing = 0
  public tileHeight = 0
  public tileWidth = 0
  public image: {
    source: string
    height: number
    width: number
  } = {
    height: 0,
    source: '',
    width: 0,
  }

  public tileOffset?: {
    x: number
    y: number
  }
  textures: Texture[]

  constructor(route: string, tileSet: ITileSetData) {
    Object.assign(this, tileSet)

    this.textures = []

    for (const tile of tileSet.tiles) {
      let texture = Texture.EMPTY
      if (tile?.image?.source) {
        texture = Texture.from(tile.image.source)
      }
      this.textures.push(texture)
    }
  }
}
