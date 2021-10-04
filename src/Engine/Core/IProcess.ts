export interface IProcess {
  start(): void
  stop(): void
  update(delta: number): void
}
