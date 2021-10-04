import { Texture } from '@pixi/core'
import { Entity } from './Entities/Entity'

export enum TileType {
  LAND = 0,
  ROAD = 1,
}

export class Tile extends Entity {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    type: TileType,
  ) {
    let spriteName: string
    switch (type) {
      case TileType.LAND:
        spriteName = 'assets/textures/land.png'
        break
      case TileType.ROAD:
        spriteName = 'assets/textures/road.png'
        break
    }
    const sprite = Texture.from(spriteName)

    super(sprite)

    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  public update(delta: number): void {
    // TODO: implement
  }
}
