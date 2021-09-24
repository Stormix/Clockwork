﻿import { IMessageHandler } from './'
import { Message } from './'

/** A message callback function pointer type. */
export type MessageCallback = (message: Message) => void

/**
 * Represents a subscription to a message and holds a handler pointer.
 */
export class MessageSubscriptionNode {
  /**
   * The message code being subscribed to.
   */
  public code: string

  /**
   * The message handler.
   */
  public handler: IMessageHandler | null

  /**
   * A callback to be made for handlers which do not use the interface.
   */
  public callback: MessageCallback | null

  /**
   * Creates a new MessageSubscriptionNode.
   * @param code The message code being subscribed to.
   * @param handler The message handler.
   * @param callback The message callback.
   */
  public constructor(
    code: string,
    handler: IMessageHandler | null,
    callback: MessageCallback | null,
  ) {
    this.code = code
    this.handler = handler ?? null
    this.callback = callback ?? null
  }
}

/**
 * Represents a queued message with a handler pointer and/or callback.
 */
export class MessageQueueNode {
  /**
   * The message code being subscribed to.
   */
  public message: Message

  /**
   * The message handler.
   */
  public handler: IMessageHandler | null

  /**
   * A callback to be made for handlers which do not use the interface.
   */
  public callback: MessageCallback | null

  /**
   * Creates a new MessageSubscriptionNode.
   * @param message The message code being subscribed to.
   * @param handler The message handler.
   * @param callback The message callback.
   */
  public constructor(
    message: Message,
    handler: IMessageHandler | null,
    callback: MessageCallback | null,
  ) {
    this.message = message
    this.handler = handler
    this.callback = callback
  }
}
