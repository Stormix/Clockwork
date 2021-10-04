import { Engine } from '../Engine'

type LogLevelType = 'debug' | 'error' | 'info' | 'log' | 'warn'

export class Logger {
  log(level: LogLevelType, ...args: any[]): void {
    console[level](
      `%c ${Engine._name}:`,
      'color: #499ceb',
      ...args,
      '|',
      new Date().toUTCString(),
    )
  }

  info(...args: any[]): void {
    this.log('info', ...args)
  }
  debug(...args: any[]): void {
    this.log('debug', ...args)
  }
  warn(...args: any[]): void {
    this.log('warn', ...args)
  }
  error(...args: any[]): void {
    this.log('error', ...args)
  }
}

export default new Logger()
