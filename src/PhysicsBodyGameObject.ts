import GameObject from "./GameObject"

export default class PhysicsBodyGameObject extends GameObject {
  private _x2: number
  private _y2: number
  protected _mainBody: Phaser.Physics.Arcade.Body

  protected get mainBody(): Phaser.Physics.Arcade.Body { return this._mainBody }
  protected set mainBody(b: Phaser.Physics.Arcade.Body) {
    this._mainBody = b
    this._x2 = b.x + b.width
    this._y2 = b.y + b.height
  }

  get x1(): number { return this.mainBody.x }
  get x2(): number { return this._x2 }
  get y1(): number { return this.mainBody.y }
  get y2(): number { return this._y2 }
  get width(): number { return this.mainBody.width }
  get height(): number { return this.mainBody.height }
}