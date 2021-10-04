import { Message } from '../Messaging/Message'
import { InputEventMessage } from './InputEventMessage'

export class InputManager {
  private constructor() {}

  private static _keys: { [key: string]: boolean } = {}
  private static _viewport: HTMLCanvasElement

  public static initialize(viewport: HTMLCanvasElement) {
    InputManager._viewport = viewport

    window.addEventListener('keydown', InputManager.onKeyDown)
    window.addEventListener('keyup', InputManager.onKeyUp)
  }

  public static isKeyDown(key: string): boolean {
    return !!InputManager._keys?.[key] == false
  }

  public static isKeyUp(key: string): boolean {
    return !!InputManager._keys?.[key] == true
  }

  private static onKeyDown(event: KeyboardEvent) {
    InputManager._keys[event.code] = true
    Message.send(InputEventMessage.KeyDown, null, event)
  }

  private static onKeyUp(event: KeyboardEvent) {
    InputManager._keys[event.code] = false
    Message.send(InputEventMessage.KeyUp, null, event)
  }
}
