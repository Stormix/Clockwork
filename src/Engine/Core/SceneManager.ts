import { Scene } from './Scene'

export class SceneManager {
  private _scenes: Scene[]
  private _currentScene: Scene

  constructor() {
    this._scenes = []
  }

  public addScene(scene: Scene): void {
    this._scenes.push(scene)
  }

  public getCurrentScene(): Scene {
    return this._currentScene
  }

  public setCurrentScene(scene: Scene): void {
    this._currentScene = scene
  }
}
