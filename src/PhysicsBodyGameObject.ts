import GameObject from "./GameObject"

export default abstract class PhysicsBodyGameObject extends GameObject {
  protected _mainBody: Phaser.Physics.Arcade.Body

  protected get mainBody(): Phaser.Physics.Arcade.Body { return this._mainBody }
  protected set mainBody(b: Phaser.Physics.Arcade.Body) {
    this._mainBody = b
  }

  get x1(): number { return this._mainBody.x }
  get x2(): number { return this._mainBody.x + this._mainBody.width }
  get y1(): number { return this._mainBody.y }
  get y2(): number { return this._mainBody.y + this._mainBody.height }
  get width(): number { return this.mainBody.width }
  get height(): number { return this.mainBody.height }
}