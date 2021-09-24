﻿import { MESSAGE_ASSET_LOADER_ASSET_LOADED, AssetManager } from '../Assets/'
import { JsonAsset } from '../Assets/'
import { Message } from '../Message/'
import { Color } from './'
import { Material } from './'

/**
 * Holds reference information for a given material.
 */
class MaterialReferenceNode {
  /** The referenced material. */
  public material: Material | null = null

  /** The number of times the material is referenced. Default is 1 because this is only created when a material is needed. */
  public referenceCount = 1

  /**
   * Creates a new MaterialReferenceNode.
   * @param material The material to be referenced.
   */
  public constructor(material: Material) {
    this.material = material
  }
}

/** Represents the configuration for a material. These are typically created and stored in a materials file. */
export class MaterialConfig {
  /** The name of this material. */
  public name: string

  /** The name of the shader used by this material. Default: null (BuiltinShader.BASIC) */
  public shader?: string

  /** The diffuse texture path of this material. */
  public diffuse: string

  /** The specular texture path of this material. */
  public specular: string

  /** The tint of this material. */
  public tint: Color

  public static fromJson(json: any): MaterialConfig {
    const config = new MaterialConfig()
    if (json.name) {
      config.name = String(json.name)
    }

    if (json.shader) {
      config.shader = String(json.shader)
    }

    if (json.diffuse) {
      config.diffuse = String(json.diffuse)
    }

    if (json.specular) {
      config.specular = String(json.specular)
    }

    if (json.tint) {
      config.tint = Color.fromJson(json.tint)
    } else {
      config.tint = Color.white()
    }

    return config
  }
}

/**
 * Manages materials in the engine. This is responsible for managing material references, and automatically
 * destroying unreferenced materials.
 */
export class MaterialManager {
  private static _configLoaded = false
  private static _materials: { [name: string]: MaterialReferenceNode | null } =
    {}
  private static _materialConfigs: { [name: string]: MaterialConfig } = {}

  /** Private to enforce singleton pattern. */
  private constructor() {}

  /** Indicates if this manager is loaded. */
  public static get isLoaded(): boolean {
    return MaterialManager._configLoaded
  }

  /**
   * The message handler.
   * @param message The message to be handled.
   */
  public static onMessage(message: Message): void {
    // TODO: one for each asset.
    if (
      message.code ===
      MESSAGE_ASSET_LOADER_ASSET_LOADED + 'assets/materials/baseMaterials.json'
    ) {
      Message.unsubscribeCallback(
        MESSAGE_ASSET_LOADER_ASSET_LOADED +
          'assets/materials/baseMaterials.json',
        MaterialManager.onMessage,
      )

      MaterialManager.processMaterialAsset(message.context as JsonAsset)
    }
  }

  /** Loads this manager. */
  public static load(): void {
    // Get the asset(s). TODO: This probably should come from a central asset manifest.
    const asset = AssetManager.getAsset('assets/materials/baseMaterials.json')
    if (asset) {
      MaterialManager.processMaterialAsset(asset as JsonAsset)
    } else {
      // Listen for the asset load.
      Message.subscribeCallback(
        MESSAGE_ASSET_LOADER_ASSET_LOADED +
          'assets/materials/baseMaterials.json',
        MaterialManager.onMessage,
      )
    }
  }

  /**
   * Registers the provided material with this manager.
   * @param material The material to be registered.
   */
  public static registerMaterial(materialConfig: MaterialConfig): void {
    MaterialManager._materialConfigs[materialConfig.name] =
      MaterialManager._materialConfigs?.[materialConfig.name] ?? materialConfig
  }

  /**
   * Gets a material with the given name. This is case-sensitive. If no material is found, null is returned.
   * Also increments the reference count by 1.
   * @param materialName The name of the material to retrieve. Case sensitive.
   */
  public static getMaterial(materialName: string): Material | null {
    const material = MaterialManager._materials[materialName]
    if (!material) {
      // Check if a config is registered.
      if (MaterialManager._materialConfigs[materialName]) {
        const mat = Material.FromConfig(
          MaterialManager._materialConfigs[materialName],
        )
        MaterialManager._materials[materialName] = new MaterialReferenceNode(
          mat,
        )
        return MaterialManager._materials[materialName]?.material ?? null
      }
      return null
    } else {
      material.referenceCount++
      return material.material ?? null
    }
  }

  /**
   * Releases a reference of a material with the provided name and decrements the reference count.
   * If the material's reference count is 0, it is automatically released.
   * @param materialName The name of the material to be released.
   */
  public static releaseMaterial(materialName: string): void {
    const material = MaterialManager._materials[materialName]
    if (!material) {
      console.warn('Cannot release a material which has not been registered.')
    } else {
      material.referenceCount--
      if (material.referenceCount < 1) {
        material.material?.destroy()
        material.material = null
        delete MaterialManager._materials[materialName]
      }
    }
  }

  private static processMaterialAsset(asset: JsonAsset | null): void {
    const materials = asset?.Data.materials
    if (materials) {
      for (const material of materials) {
        const c = MaterialConfig.fromJson(material)
        MaterialManager.registerMaterial(c)
      }
    }

    // TODO: Should only set this if ALL queued assets have loaded.
    MaterialManager._configLoaded = true
  }
}
