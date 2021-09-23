import { Texture } from './Texture'

/**
 * Holds reference information for a given Texture.
 */
class TextureReferenceNode {
  /** The referenced Texture. */
  public texture: Texture

  /** The number of times the Texture is referenced. Default is 1 because this is only created when a Texture is needed. */
  public referenceCount = 1

  /**
   * Creates a new TextureReferenceNode.
   * @param texture The Texture to be referenced.
   */
  public constructor(texture: Texture) {
    this.texture = texture
  }
}

/**
 * Manages Textures in the engine. This is responsible for managing Texture references, and automatically
 * destroying unreferenced Texture.
 */
export class TextureManager {
  private static _textures: { [name: string]: TextureReferenceNode | null } = {}

  /** Private to enforce singleton pattern. */
  private constructor() {}

  /**
   * Gets a Texture with the given name. This is case-sensitive. If no Texture is found, undefined is returned.
   * Also increments the reference count by 1.
   * @param textureName The name of the texture to get. If one is not found, a new one is created, using this as the texture path.
   */
  public static getTexture(textureName: string): Texture | null {
    const texture = TextureManager._textures[textureName]
    if (!texture) {
      const texture = new Texture(textureName)
      TextureManager._textures[textureName] = new TextureReferenceNode(texture)
    } else {
      texture.referenceCount++
    }

    return TextureManager._textures[textureName]?.texture ?? null
  }

  /**
   * Releases a reference of a Texture with the provided name and decrements the reference count.
   * If the Texture's reference count is 0, it is automatically released.
   * @param textureName The name of the Texture to be released.
   */
  public static releaseTexture(textureName: string): void {
    const texture = TextureManager._textures[textureName]
    if (!texture) {
      console.warn(
        `A texture named ${textureName} does not exist and therefore cannot be released.`,
      )
    } else {
      texture.referenceCount--
      if (texture.referenceCount < 1) {
        TextureManager._textures[textureName]?.texture.destroy()
        TextureManager._textures[textureName] = null
        delete TextureManager._textures[textureName]
      }
    }
  }
}
