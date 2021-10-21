export class Utilities {
  public static exists(obj: any): boolean {
    return obj !== undefined && obj !== null
  }
  public static randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}

export interface Scale {
  x: number
  y: number
}
