import { IMessage } from './IMessage'

export interface IMessageHandler {
  onMessage(message: IMessage): void
}
