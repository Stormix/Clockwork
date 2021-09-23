import { IGame } from '../../Game/IGame'
import { gl } from '../GL/GLUtilities'
import { Matrix4x4 } from '../Math/Matrix4x4'
import { LevelManager } from '../World/LevelManager'
import {
  RendererViewport,
  RendererViewportCreateInfo,
} from './RendererViewport'
import { RenderView } from './RenderView'

/**
 * Responsible for handling rendering jobs within the engine.
 */
export class Renderer {
  private _windowViewport: RendererViewport
  private _defaultView: Matrix4x4
  private _renderView: RenderView

  /**
   * Creates a new Renderer.
   * @param createInfo The creation info used to create this renderer.
   */
  public constructor(createInfo: RendererViewportCreateInfo) {
    this._windowViewport = new RendererViewport(createInfo)
    this._defaultView = Matrix4x4.identity()
    this._renderView = new RenderView()
  }

  /** Returns the canvas used by the viewport. */
  public get windowViewportCanvas(): HTMLCanvasElement {
    return this._windowViewport.canvas
  }

  /** Called when the viewport is resized. */
  public OnResize(): void {
    if (this._windowViewport) {
      this._windowViewport.OnResize(window.innerWidth, window.innerHeight)
    }
  }

  /**
   * Begins the render process.
   * @param time The time in milliseconds since the last frame.
   * @param game The game to be rendered.
   */
  public BeginRender(time: number, game: IGame): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Update the render view for the world pass.
    this._renderView.deltaTime = time
    this._renderView.flipProjection = false
    this._renderView.fov = this._windowViewport.fov
    this._renderView.projectionMatrix =
      this._windowViewport.GetProjectionMatrix()
    this._renderView.shortenZNear = false
    this._renderView.globalMaterial = null // NOTE: Additional render passes could specify a different material here.

    // Render the world.
    this.renderWorld()

    // Render the gui
    this.renderGui()

    game.Render(time, this._renderView)
  }

  /**
   * Ends the render process.
   */
  public EndRender(): void {
    // TODO: swap buffer here
  }

  private renderWorld(): void {
    // If there is an active level loaded, generate a render view and pass it through.
    if (LevelManager.isLoaded && LevelManager.activeLevel !== undefined) {
      const view =
        LevelManager.activeLevel?.activeCamera?.view ?? this._defaultView

      // Update view matrix.
      this._renderView.viewMatrix = view

      LevelManager.activeLevel?.render(this._renderView)
    }
  }

  private renderGui(): void {
    // TODO: When the gui system is implemented, render it here.
  }
}
