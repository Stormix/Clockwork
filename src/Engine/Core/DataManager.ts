export class DataManager {
  private static _data: { [key: string]: any } = {}

  private constructor() {
    //
  }

  public static setValue(key: string, value: any): void {
    this._data[key] = value
  }

  public static getValue<T>(key: string): T {
    return this._data[key] as T
  }

  public static remove(key: string): void {
    delete this._data[key]
  }

  public static clearData(): void {
    this._data = {}
  }
}
