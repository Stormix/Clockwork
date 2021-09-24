import { AssetManager } from './'
import { IAsset } from './'
import { IAssetLoader } from './'

/** Represents an Json asset */
export class JsonAsset implements IAsset {
  /** The name of this asset. */
  public readonly Name: string

  /** The data of this asset. */
  public readonly Data: any

  /**
   * Creates a new image asset.
   * @param name The name of this asset.
   * @param data The data of this asset.
   */
  public constructor(name: string, data: any) {
    this.Name = name
    this.Data = data
  }
}

/** Represents an Json asset loader. */
export class JsonAssetLoader implements IAssetLoader {
  /** The extensions supported by this asset loader. */
  public get supportedExtensions(): string[] {
    return ['json']
  }

  /**
   * Loads an asset with the given name.
   * @param assetName The name of the asset to be loaded.
   */
  public LoadAsset(assetName: string): void {
    const request: XMLHttpRequest = new XMLHttpRequest()
    request.open('GET', assetName)
    request.addEventListener(
      'load',
      this.onJsonLoaded.bind(this, assetName, request),
    )
    request.send()
  }

  private onJsonLoaded(assetName: string, request: XMLHttpRequest): void {
    if (request.readyState === request.DONE) {
      if (!request.responseText) {
        console.warn('Failed to load asset: ' + assetName)
        return
      }
      const json = JSON.parse(request.responseText)
      const asset = new JsonAsset(assetName, json)
      AssetManager.onAssetLoaded(asset)
    }
  }
}
