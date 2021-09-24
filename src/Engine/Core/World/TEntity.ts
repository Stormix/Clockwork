import { IBehavior } from '../Behaviors/'
import { IComponent } from '../Components/'
import { Matrix4x4 } from '../Math/'
import { Transform } from '../Math/'
import { Vector3 } from '../Math/'
import { TObject } from '../Objects/'
import { RenderView } from '../Renderer/'
import { SceneGraph } from './'

/**
 * Represents a single entity in the world. TEntities themselves do not get rendered or have behaviors.
 * The do, however, have transforms and may have child TEntities. Components and behaviors may be
 * attached to TEntities to decorate functionality.
 */
export class TEntity extends TObject {
  private _children: TEntity[] = []
  private _parent: TEntity | null = null
  private _isLoaded = false
  private _sceneGraph: SceneGraph | null = null
  private _components: IComponent[] = []
  private _behaviors: IBehavior[] = []
  private _isVisible = true

  private _localMatrix: Matrix4x4 = Matrix4x4.identity()
  private _worldMatrix: Matrix4x4 = Matrix4x4.identity()

  /** The name of this object. */
  public name: string

  /** The transform of this entity. */
  public transform: Transform = new Transform()

  /**
   * Creates a new entity.
   * @param name The name of this entity.
   * @param sceneGraph The scenegraph to which this entity belongs.
   */
  public constructor(name: string, sceneGraph?: SceneGraph) {
    super()
    this.name = name
    this._sceneGraph = sceneGraph ?? null
  }

  /** Returns the parent of this entity. */
  public get parent() {
    return this._parent
  }

  /** Returns the world transformation matrix of this entity. */
  public get worldMatrix(): Matrix4x4 {
    return this._worldMatrix
  }

  /** Indicates if this entity has been loaded. */
  public get isLoaded(): boolean {
    return this._isLoaded
  }

  /** Indicates if this entity is currently visible. */
  public get isVisible(): boolean {
    return this._isVisible
  }

  /** Sets visibility of this entity. */
  public set isVisible(value: boolean) {
    this._isVisible = value
  }

  /**
   * Adds the provided entity as a child of this one.
   * @param child The child to be added.
   */
  public addChild(child: TEntity): void {
    if (!this._sceneGraph) {
      throw new Error('Cannot add child to entity without a scene graph.')
    }
    child._parent = this
    this._children.push(child)
    child.onAdded(this._sceneGraph)
  }

  /**
   * Attempts to remove the provided entity as a child of this one, if it is in fact
   * a child of this entity. Otherwise, nothing happens.
   * @param child The child to be added.
   */
  public removeChild(child: TEntity): void {
    const index = this._children.indexOf(child)
    if (index !== -1) {
      child._parent = null
      this._children.splice(index, 1)
    }
  }

  /**
   * Recursively attempts to retrieve a component with the given name from this entity or its children.
   * @param name The name of the component to retrieve.
   */
  public getComponentByName(name: string): IComponent | null {
    for (const component of this._components) {
      if (component.name === name) {
        return component
      }
    }

    for (const child of this._children) {
      const component = child.getComponentByName(name)
      if (component ) {
        return component
      }
    }

    return null
  }

  /**
   * Recursively attempts to retrieve a behavior with the given name from this entity or its children.
   * @param name The name of the behavior to retrieve.
   */
  public getBehaviorByName(name: string): IBehavior | null {
    for (const behavior of this._behaviors) {
      if (behavior.name === name) {
        return behavior
      }
    }

    for (const child of this._children) {
      const behavior = child.getBehaviorByName(name)
      if (behavior ) {
        return behavior
      }
    }

    return null
  }

  /**
   * Recursively attempts to retrieve a child entity with the given name from this entity or its children.
   * @param name The name of the entity to retrieve.
   */
  public getEntityByName(name: string): TEntity | null {
    if (this.name === name) {
      return this
    }

    for (const child of this._children) {
      const result = child.getEntityByName(name)
      if (result ) {
        return result
      }
    }

    return null
  }

  /**
   * Adds the given component to this entity.
   * @param component The component to be added.
   */
  public addComponent(component: IComponent): void {
    this._components.push(component)
    component.setOwner(this)
  }

  /**
   * Adds the given behavior to this entity.
   * @param behavior The behavior to be added.
   */
  public addBehavior(behavior: IBehavior): void {
    this._behaviors.push(behavior)
    behavior.setOwner(this)
  }

  /** Performs loading procedures on this entity. */
  public load(): void {
    this._isLoaded = true

    for (const c of this._components) {
      c.load()
    }

    for (const c of this._children) {
      c.load()
    }
  }

  /** Performs pre-update procedures on this entity. */
  public updateReady(): void {
    for (const c of this._components) {
      c.updateReady()
    }

    for (const b of this._behaviors) {
      b.updateReady()
    }

    for (const c of this._children) {
      c.updateReady()
    }
  }

  /**
   * Performs update procedures on this entity (recurses through children,
   * components and behaviors as well).
   * @param time The delta time in milliseconds since the last update call.
   */
  public update(time: number): void {
    this._localMatrix = this.transform.getTransformationMatrix()

    this.updateWorldMatrix(this._parent?.worldMatrix ?? null)

    for (const c of this._components) {
      c.update(time)
    }

    for (const b of this._behaviors) {
      b.update(time)
    }

    for (const c of this._children) {
      c.update(time)
    }
  }

  /**
   * Renders this entity and its children.
   */
  public render(renderView: RenderView): void {
    if (!this._isVisible) {
      return
    }

    for (const c of this._components) {
      c.render(renderView)
    }

    for (const c of this._children) {
      c.render(renderView)
    }
  }

  /** Returns the world position of this entity. */
  public getWorldPosition(): Vector3 {
    return new Vector3(
      this._worldMatrix.data[12],
      this._worldMatrix.data[13],
      this._worldMatrix.data[14],
    )
  }

  /**
   * Called when this entity is added to a scene graph.
   * @param sceneGraph The scenegraph to which this entity was added.
   */
  protected onAdded(sceneGraph: SceneGraph): void {
    this._sceneGraph = sceneGraph
  }

  private updateWorldMatrix(parentWorldMatrix: Matrix4x4 | null): void {
    if (parentWorldMatrix) {
      this._worldMatrix = Matrix4x4.multiply(
        parentWorldMatrix,
        this._localMatrix,
      )
    } else {
      this._worldMatrix.copyFrom(this._localMatrix)
    }
  }
}
