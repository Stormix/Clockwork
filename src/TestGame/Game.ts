import { RenderView } from '../Engine/Core/Renderer/RenderView'
import { LevelManager } from '../Engine/Core/World/LevelManager'
import { IGame } from '../Engine/Game/IGame'

/**
 * Represents an object that holds game-specific information.
 */
export class Game implements IGame {
  /**
   * Called before the main update loop, after updateReady has been called on the engine subsystems.
   * Used for loading the first/initial level, etc.
   */
  public UpdateReady(): void {
    // Load the test level. This should be configurable.
    LevelManager.changeLevel('test 1')
  }

  /**
   * Performs update procedures on this game. Called after all engine subsystems have updated.
   * @param time The delta time in milliseconds since the last update.
   */
  public Update(time: number): void {}

  /**
   * Renders this game. Called after all engine subsystems have rendered.
   * @param time The delta time in milliseconds since the last frame.
   * @param renderView The view of information used for this render pass.
   */
  public Render(time: number, renderView: RenderView): void {}
}
