import Stats from 'stats.js'
import { Game } from '../Game/Game'
import { DEBUG_MODE } from './Config/Constants'
import { InputManager } from './Core/Input/InputManager'
import logger from './Core/Logger'
import { Renderer } from './Core/Renderer'
import * as PIXI from 'pixi.js'

declare global {
  interface Window {
    __PIXI_INSPECTOR_GLOBAL_HOOK__: any
  }
}
export class Engine {
  public static _name = 'Clockwork Engine'
  public static _version = '0.0.1'

  private _gameArea: HTMLElement
  private _viewport: HTMLCanvasElement
  private _aspect: number
  private _gameTime = 0
  private _renderer: Renderer
  private _elapsed = 0
  private _width: number
  private _height: number
  private _game: any
  private _stats: Stats

  constructor(canvas: HTMLCanvasElement, gameArea: HTMLElement) {
    this._viewport = canvas
    this._gameArea = gameArea
    if (DEBUG_MODE) this._stats = new Stats()
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  private calculateAspectRatio(width: number, height: number) {
    if (width > height) {
      return width / height
    } else {
      return height / width
    }
  }

  private onWindowResize() {
    // logger.debug('Window resized')

    let width = window.innerWidth
    let height = window.innerHeight

    const windowAspectRatio = this.calculateAspectRatio(width, height)

    if (windowAspectRatio >= this._aspect) {
      width = height * this._aspect
    } else {
      height = width / this._aspect
    }

    this._gameArea.style.width = width + 'px'
    this._gameArea.style.height = height + 'px'

    this._gameArea.style.marginTop = -height / 2 + 'px'
    this._gameArea.style.marginLeft = -width / 2 + 'px'

    this._renderer.resize(width, height)

    this._width = width
    this._height = height
  }

  private update(deltaTime: number) {
    this._game.update(deltaTime)
  }

  private render() {
    this._game.render(this._renderer)
  }

  private loop(newTime: number) {
    requestAnimationFrame(this.loop.bind(this))

    // Mesure time
    const lastTime = this._gameTime
    this._gameTime = newTime
    const deltaTime = (this._gameTime - lastTime) / 1000
    this._elapsed += deltaTime

    // Update
    if (DEBUG_MODE) this._stats.begin()
    this.update(deltaTime)
    this.render()
    if (DEBUG_MODE) this._stats.end()
  }

  start(width: number, height: number, game: Game) {
    logger.debug('Engine started')
    this._renderer = new Renderer(width, height, this._viewport)

    // Display stats
    if (DEBUG_MODE) {
      this._stats.showPanel(0)
      document.body.appendChild(this._stats.dom)
      // Pixi Inspector
      if (window?.__PIXI_INSPECTOR_GLOBAL_HOOK__) {
        window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
      }
    }

    // Load managers
    InputManager.initialize(this._viewport)

    // Set canvas size
    this._viewport.width = width
    this._viewport.height = height

    this._width = width
    this._height = height

    // Calculate aspect ratio
    // this._aspect = this.calculateAspectRatio(width, height)

    // Events
    // window.addEventListener('resize', () => {
    //   this.onWindowResize()
    // })

    // Init window size
    // this.onWindowResize()

    // Start game
    this._game = game
    this._game.start()

    // start loop
    this.loop(0)
  }
}
