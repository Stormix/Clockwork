import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../Assets/'
import { JsonAsset } from '../Assets/'
import { Message } from '../Message/'
import { Level } from './'

/**
 * Manages levels in the engine. Levels (for now) are registered with this manager
 * so that they may be loaded on demand. Register a level name
 * with a file path and load the level configurations dynamically.
 */
export class LevelManager {
  private static _registeredLevels: { [name: string]: string } = {}
  private static _activeLevel: Level | null = null
  private static _configLoaded = false

  /** Private constructor to enforce singleton pattern. */
  private constructor() {}

  /** Indicates if this manager is loaded. */
  public static get isLoaded(): boolean {
    return LevelManager._configLoaded
  }

  /** Gets the active level. */
  public static get activeLevel() {
    return LevelManager._activeLevel
  }

  /** Loads this manager. */
  public static load(): void {
    // Get the asset(s). TODO: This probably should come from a central asset manifest.
    const asset = AssetManager.getAsset('assets/levels/levels.json')
    if (asset) {
      LevelManager.processLevelConfigAsset(asset)
    } else {
      // Listen for the asset load.
      Message.subscribeCallback(
        MESSAGE_ASSET_LOADER_ASSET_LOADED + 'assets/levels/levels.json',
        LevelManager.onMessage,
      )
    }
  }

  /**
   * Changes the active level to the one with the provided name.
   * @param name The name of the level to change to.
   */
  public static changeLevel(name: string): void {
    console.log('Changing level to:' + name)
    if (LevelManager._activeLevel) {
      LevelManager._activeLevel?.onDeactivated()
      LevelManager._activeLevel?.unload()
      LevelManager._activeLevel = null
    }

    // Make sure the level is registered.
    if (LevelManager._registeredLevels[name]) {
      // If the level asset is already loaded, get it and use it to load the level.
      // Otherwise, retrieve the asset and load the level upon completion.
      if (AssetManager.isAssetLoaded(LevelManager._registeredLevels[name])) {
        const asset = AssetManager.getAsset(
          LevelManager._registeredLevels[name],
        )
        if (asset) {
          LevelManager.loadLevel(asset)
        } else {
          console.warn('LevelManager: Failed to load level asset: ' + asset)
        }
      } else {
        Message.subscribeCallback(
          MESSAGE_ASSET_LOADER_ASSET_LOADED +
            LevelManager._registeredLevels[name],
          LevelManager.onMessage,
        )
        AssetManager.loadAsset(LevelManager._registeredLevels[name])
      }
    } else {
      throw new Error('Level named:' + name + ' is not registered.')
    }
  }

  /**
   * The message handler.
   * @param message The message to be handled.
   */
  public static onMessage(message: Message): void {
    // TODO: one for each asset.
    if (
      message.code ===
      MESSAGE_ASSET_LOADER_ASSET_LOADED + 'assets/levels/levels.json'
    ) {
      Message.unsubscribeCallback(
        MESSAGE_ASSET_LOADER_ASSET_LOADED + 'assets/levels/levels.json',
        LevelManager.onMessage,
      )

      LevelManager.processLevelConfigAsset(message.context as JsonAsset)
    } else if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
      console.log('Level loaded:' + message.code)
      const asset = message.context as JsonAsset
      LevelManager.loadLevel(asset)
    }
  }

  private static loadLevel(asset: JsonAsset): void {
    const data = asset.Data

    let levelName: string
    if (!data?.name) {
      throw new Error('Zone file format exception: Zone name not present.')
    } else {
      levelName = String(data.name)
    }

    const description = data?.description ?? '' // TODO: maybe wrap with string again

    LevelManager._activeLevel = new Level(levelName, description)
    LevelManager._activeLevel.initialize(data)
    LevelManager._activeLevel.onActivated()
    LevelManager._activeLevel.load()

    Message.send('LEVEL_LOADED', this)
  }

  private static processLevelConfigAsset(asset: JsonAsset | null): void {
    const levels = asset?.Data.levels
    if (levels) {
      for (const level of levels) {
        if (level.name && level.file) {
          LevelManager._registeredLevels[level.name] = String(level.file)
        } else {
          throw new Error(
            'Invalid level config file format: name or file is missing',
          )
        }
      }
    }

    // TODO: Should only set this if ALL queued assets have loaded.
    LevelManager._configLoaded = true
  }
}
