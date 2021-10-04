import Logger from '../Logger'
import { Utilities } from '../Utilities'
import { IMessage } from './IMessage'
import { IMessageHandler } from './IMessageHandler'

export class Message implements IMessage {
  private static _subscriptions: Record<string, IMessageHandler[]> = {}

  code: string
  sender: any
  context: any

  constructor(code: string, sender: any, context: any) {
    this.code = code
    this.sender = sender
    this.context = context
  }

  public static subscribe(code: string, handler: IMessageHandler) {
    if (!Utilities.exists(Message._subscriptions[code])) {
      Message._subscriptions[code] = []
    }
    Message._subscriptions[code].push(handler)
  }

  public static unsubscribe(code: string, handler: IMessageHandler) {
    if (Utilities.exists(Message._subscriptions[code])) {
      const index = Message._subscriptions[code].indexOf(handler)
      if (index > -1) {
        Message._subscriptions[code].splice(index, 1)
        if (Message._subscriptions[code].length === 0)
          delete Message._subscriptions[code]
      }
      return
    }
    Logger.debug(`No handlers subscribed to message code ${code}`)
  }

  public static send(code: string, sender: any, context: any) {
    if (Utilities.exists(Message._subscriptions[code])) {
      const message = new Message(code, sender, context)
      for (const handler of Message._subscriptions[code]) {
        handler.onMessage(message)
      }
      return
    }
    Logger.debug(`No handlers subscribed to message code ${code}`)
  }
}
