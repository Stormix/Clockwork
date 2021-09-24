import { Material } from '../Graphics/'
import { Matrix4x4 } from '../Math/'

export class RenderView {
  public viewMatrix: Matrix4x4
  public projectionMatrix: Matrix4x4

  public fov: number
  public shortenZNear: boolean
  public flipProjection: boolean

  public deltaTime: number

  // An override material used to render everything. Default: null.
  public globalMaterial: Material | null
}
