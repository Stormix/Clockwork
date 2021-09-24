﻿import {
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
  AssetManager,
  ImageAsset,
} from '../Assets/'
import { Vector2 } from '../Math/'
import { IMessageHandler, Message } from '../Message/'
import { MaterialManager, Sprite } from './'

class UVInfo {
  public min: Vector2
  public max: Vector2

  public constructor(min: Vector2, max: Vector2) {
    this.min = min
    this.max = max
  }
}

/**
 * Info used to create an animated sprite graphics object.
 */
export class AnimatedSpriteInfo {
  /** The name of this sprite */
  public name: string

  /** The name of the material used by this sprite */
  public materialName: string

  /** The width of this sprite. */
  public width = 100

  /** The height of this sprite. */
  public height = 100

  /** The frame width of this sprite. */
  public frameWidth = 10

  /** The frame height of this sprite. */
  public frameHeight = 10

  /** The number of frames to be animated. */
  public frameCount = 1

  /** The sequence of frame indexes to be played. */
  public frameSequence: number[] = []

  /** The number of milliseconds each frame takes. */
  public frameTime = 60
}

/**
 * Represents a 2-dimensional sprite which is drawn on the screen.
 * */
export class AnimatedSprite extends Sprite implements IMessageHandler {
  private _frameHeight: number
  private _frameWidth: number
  private _frameCount: number
  private _frameSequence: number[]

  private _frameTime = 33
  private _frameUVs: UVInfo[] = []

  private _currentFrame = 0
  private _currentTime = 0
  private _assetLoaded = false
  private _assetWidth = 2
  private _assetHeight = 2
  private _isPlaying = true

  /**
   * Creates a new sprite.
   * @param info The information used to create this animated sprite.
   */
  public constructor(info: AnimatedSpriteInfo) {
    super(info.name, info.materialName, info.width, info.height)

    this._frameWidth = info.frameWidth
    this._frameHeight = info.frameHeight
    this._frameCount = info.frameCount
    this._frameSequence = info.frameSequence
    this._frameTime = info.frameTime

    Message.subscribe(
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this._material?.diffuseTextureName,
      this,
    )
  }

  /**
   * Indicates if this animated sprite is currently playing.
   */
  public get isPlaying(): boolean {
    return this._isPlaying
  }

  /**
   * Destroys this object.
   */
  public destroy(): void {
    super.destroy()
  }

  /**
   * Plays the animation.
   */
  public play(): void {
    this._isPlaying = true
  }

  /**
   * Stops the animation.
   */
  public stop(): void {
    this._isPlaying = false
  }

  /**
   * Sets the frame index of this sprite.
   * @param frameNumber The frame index to be set.
   */
  public setFrame(frameNumber: number): void {
    if (frameNumber >= this._frameCount) {
      throw new Error(
        'Frame is out of range:' +
          frameNumber +
          ', frame count:' +
          this._frameCount,
      )
    }

    this._currentFrame = frameNumber
  }

  /**
   * The message handler for this component.
   * @param message The message to be handled.
   */
  public onMessage(message: Message): void {
    if (
      message.code ===
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this._material?.diffuseTextureName
    ) {
      this._assetLoaded = true
      const asset = message.context as ImageAsset
      this._assetHeight = asset.height
      this._assetWidth = asset.width
      this.calculateUVs()
    }
  }

  /**
   * Performs loading routines on this sprite.
   * */
  public load(): void {
    super.load()

    if (!this._assetLoaded) {
      this.setupFromMaterial()
    }
  }

  /**
   * Performs update routines on this sprite.
   * @param time The delta time in milliseconds since the last update call.
   */
  public update(time: number): void {
    if (!this._assetLoaded) {
      if (!this._assetLoaded) {
        this.setupFromMaterial()
      }
      return
    }

    if (!this._isPlaying) {
      return
    }

    this._currentTime += time
    if (this._currentTime > this._frameTime) {
      this._currentFrame++
      this._currentTime = 0

      if (this._currentFrame >= this._frameSequence.length) {
        this._currentFrame = 0
      }

      const frameUVs = this._frameSequence[this._currentFrame]
      this._vertices[0].texCoords.copyFrom(this._frameUVs[frameUVs].min)
      this._vertices[1].texCoords = new Vector2(
        this._frameUVs[frameUVs].min.x,
        this._frameUVs[frameUVs].max.y,
      )
      this._vertices[2].texCoords.copyFrom(this._frameUVs[frameUVs].max)
      this._vertices[3].texCoords.copyFrom(this._frameUVs[frameUVs].max)
      this._vertices[4].texCoords = new Vector2(
        this._frameUVs[frameUVs].max.x,
        this._frameUVs[frameUVs].min.y,
      )
      this._vertices[5].texCoords.copyFrom(this._frameUVs[frameUVs].min)

      this._buffer.clearData()
      for (const v of this._vertices) {
        this._buffer.pushBackData(v.toArray())
      }

      this._buffer.upload()
      this._buffer.unbind()
    }

    super.update(time)
  }

  private calculateUVs(): void {
    let totalWidth = 0
    let yValue = 0
    for (let i = 0; i < this._frameCount; ++i) {
      totalWidth = i * this._frameWidth
      if (totalWidth > this._assetWidth) {
        yValue++
        totalWidth = 0
      }

      const u = (i * this._frameWidth) / this._assetWidth
      const v = (yValue * this._frameHeight) / this._assetHeight
      const min: Vector2 = new Vector2(u, v)

      const uMax = (i * this._frameWidth + this._frameWidth) / this._assetWidth
      const vMax =
        (yValue * this._frameHeight + this._frameHeight) / this._assetHeight
      const max: Vector2 = new Vector2(uMax, vMax)

      this._frameUVs.push(new UVInfo(min, max))
    }
  }

  private setupFromMaterial(): void {
    if (!this._assetLoaded) {
      if (!this._materialName) {
        return
      }
      const material = MaterialManager.getMaterial(this._materialName)
      if (!material) {
        return
      }
      if (material.diffuseTexture?.isLoaded) {
        if (AssetManager.isAssetLoaded(material.diffuseTextureName)) {
          this._assetHeight = material.diffuseTexture.height
          this._assetWidth = material.diffuseTexture.width
          this._assetLoaded = true
          this.calculateUVs()
        }
      }
    }
  }
}
