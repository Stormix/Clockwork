import { MESSAGE_MOUSE_UP, MouseContext } from '../Input/'
import { IMessageHandler } from '../Message/'
import { Message } from '../Message/'
import { BaseBehavior } from './'
import { BehaviorManager } from './'
import { IBehavior } from './'
import { IBehaviorBuilder } from './'
import { IBehaviorData } from './'

/**
 * The data for a mouse click behavior.
 */
export class MouseClickBehaviorData implements IBehaviorData {
  /** The name of this behavior. */
  public name: string

  /** The width of the area to be registered as a click, relative to the TEntity to which this is attached. */
  public width: number

  /** The height of the area to be registered as a click, relative to the TEntity to which this is attached. */
  public height: number

  /** The message code to be sent when a click is detected. */
  public messageCode: string

  /**
   * Sets this data from the provided json.
   * @param json The json to set from.
   */
  public setFromJson(json: any): void {
    if (!json?.name) {
      throw new Error('Name must be defined in behavior data.')
    }

    this.name = String(json.name)

    if (!json?.width) {
      throw new Error('width must be defined in behavior data.')
    } else {
      this.width = Number(json.width)
    }

    if (!json?.height) {
      throw new Error('height must be defined in behavior data.')
    } else {
      this.height = Number(json.height)
    }

    if (!json?.messageCode) {
      throw new Error('messageCode must be defined in behavior data.')
    } else {
      this.messageCode = String(json.messageCode)
    }
  }
}

/**
 * The builder for a MouseClick behavior.
 */
export class MouseClickBehaviorBuilder implements IBehaviorBuilder {
  public get type(): string {
    return 'mouseClick'
  }

  public buildFromJson(json: any): IBehavior {
    const data = new MouseClickBehaviorData()
    data.setFromJson(json)
    return new MouseClickBehavior(data)
  }
}

/**
 * A behavior which detects clicks within a given width and height, relative to the
 * position of the object to which it is attached. When clicked, a message with the
 * configured message code is sent.
 */
export class MouseClickBehavior
  extends BaseBehavior
  implements IMessageHandler
{
  private _width: number
  private _height: number
  private _messageCode: string

  /**
   * Creates a new MouseClickBehavior.
   * @param data The data for this behavior.
   */
  public constructor(data: MouseClickBehaviorData) {
    super(data)

    this._width = data.width
    this._height = data.height
    this._messageCode = data.messageCode
    Message.subscribe(MESSAGE_MOUSE_UP, this)
  }

  /**
   * The message handler.
   * @param message The message to be handled.
   */
  public onMessage(message: Message): void {
    if (message.code === MESSAGE_MOUSE_UP) {
      if (!this._owner.isVisible) {
        return
      }
      const context = message.context as MouseContext
      const worldPos = this._owner.getWorldPosition()
      const extentsX = worldPos.x + this._width
      const extentsY = worldPos.y + this._height
      if (
        context.position.x >= worldPos.x &&
        context.position.x <= extentsX &&
        context.position.y >= worldPos.y &&
        context.position.y <= extentsY
      ) {
        // Send the c onfigured message.
        Message.send(this._messageCode, this)
      }
    }
  }
}

// Auto-register the builder.
BehaviorManager.registerBuilder(new MouseClickBehaviorBuilder())
