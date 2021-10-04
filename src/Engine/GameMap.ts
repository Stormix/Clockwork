import { Container } from '@pixi/display'
import { LayerManager, LayerType } from './Core/LayerManager'
import Logger from './Core/Logger'
import { Point } from './Core/Point'
import { Tile, TileType } from './Tile'

export interface MapData {
  height: number
  width: number
  data: number[][]
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
}

export class GameMap {
  private _height: number
  private _width: number
  private _start: Point
  private _end: Point
  private _tileSize: number
  private _cells: Tile[] = []

  constructor(width: number, height: number, tileSize: number, random = false) {
    this._width = width
    this._height = height
    this._tileSize = tileSize

    if (random) this.createRandomMap()
  }

  createRandomMap(seed?: number) {
    // TODO:
  }

  static fromJSON(
    json: MapData,
    tileSize: number,
    container: Container,
  ): GameMap {
    // TODO: validate json
    const map = new GameMap(json.width, json.height, tileSize)

    map._start = new Point(json.start.x, json.start.y)
    map._end = new Point(json.end.x, json.end.y)

    for (let y = 0; y < json.height; y++) {
      for (let x = 0; x < json.width; x++) {
        Logger.info(`Creating tile at ${x * tileSize}, ${y * tileSize}`)
        const tile = new Tile(
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize,
          json.data[y][x] as TileType,
        )
        tile.setLayer(LayerManager.getLayer(LayerType.Background))
        container.addChild(tile)
        map._cells.push(tile)
      }
    }

    return map
  }

  contains(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.x < this._width &&
      point.y >= 0 &&
      point.y < this._height
    )
  }
}
