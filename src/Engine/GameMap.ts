import { Container } from '@pixi/display'
import { LayerManager, LayerType } from './Core/LayerManager'
import Logger from './Core/Logger'
import { Point } from './Core/Point'
import { Tile, TileType } from './Tile'
import Rand from 'rand-seed'
import { AStarFinder } from 'astar-typescript'
export interface MapData {
  height: number
  width: number
  data: number[][]
  path: number[][]
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
  private _path: Point[] = []

  constructor(width: number, height: number, tileSize: number) {
    this._width = width
    this._height = height
    this._tileSize = tileSize
  }

  get start(): Point {
    return this._start
  }

  get end(): Point {
    return this._end
  }

  get path(): Point[] {
    return this._path
  }

  static createRandomMap(size: number, seed?: number): MapData {
    // Use a seed if provided
    const rand = seed ? new Rand(seed.toString()) : new Rand()
    const start = new Point()
    const end = new Point(size - 1, size - 1)

    // Create a random map
    Logger.info(`Creating random map with seed ${seed}`)
    Logger.info(`Start: ${start.x}, ${start.y}`)
    Logger.info(`End: ${end.x}, ${end.y}`)

    let path: number[][] = []

    while (path.length === 0) {
      // Generate a random obstable matrix
      const obstablProb = 0.4
      const matrix: number[][] = []

      for (let y = 0; y < size; y++) {
        matrix[y] = []
        for (let x = 0; x < size; x++) {
          if (x === start.x && y === start.y) {
            matrix[y][x] = 0
            continue
          }

          if (x === end.x && y === end.y) {
            matrix[y][x] = 0
            continue
          }
          matrix[y][x] = rand.next() < obstablProb ? 1 : 0
        }
      }

      // Create a path from the start to the end
      const finder = new AStarFinder({
        diagonalAllowed: false,
        heuristic: 'Manhattan',
        grid: {
          matrix,
        },
        includeStartNode: true,
        includeEndNode: true,
      })

      path = finder.findPath(start.toObject(), end.toObject())
    }

    // Create map array
    const map: number[][] = []
    for (let y = 0; y < size; y++) {
      map[y] = []
      for (let x = 0; x < size; x++) {
        map[y][x] = path.findIndex((v) => v[0] === x && v[1] === y) > -1 ? 1 : 0
      }
    }

    return {
      height: size,
      width: size,
      data: map,
      path,
      start: {
        x: start.x,
        y: start.y,
      },
      end: {
        x: end.x,
        y: end.y,
      },
    }
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
    map._path = json.path.map((v) => new Point(v[0], v[1]))
    for (let y = 0; y < json.height; y++) {
      for (let x = 0; x < json.width; x++) {
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
