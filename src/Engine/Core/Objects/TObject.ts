/**
 * The basis from which all objects should be inherited. TObjects are each given
 * a unique identifier which can be used to identify the object for debugging purposes.
 * Objects ultimately inheriting from TObject should be prefixed with a T to denote this.
 */
export abstract class TObject {
  // The global object id, which is incremented every time a new TObject is created.
  private static _GLOBAL_OBJECT_ID = 0

  private _id: number | null

  /** Creates a new TObject. */
  public constructor() {
    this._id = TObject._GLOBAL_OBJECT_ID++
  }

  /** Returns the unique identifier for this object. */
  public get ID(): number {
    return this._id ?? -1 // TODO: make sure this defaul value is never used
  }

  public destroy(): void {
    this._id = null

    // NOTE: If this is ever added to a tracking system, it should be untracked here.
  }
}
