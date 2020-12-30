import GameObject from "./GameObject"

export default abstract class PhysicsBodyGameObject extends GameObject {
  private _mainBody: Phaser.Physics.Arcade.Body

  protected get mainBody(): Phaser.Physics.Arcade.Body { return this._mainBody }
  protected set mainBody(b: Phaser.Physics.Arcade.Body) {
    this._mainBody = b
  }

  get x(): number { return this._mainBody.x + this._mainBody.width / 2 }
  get y(): number { return this._mainBody.y + this._mainBody.height / 2 }
  get x1(): number { return this._mainBody.x }
  get x2(): number { return this._mainBody.x + this._mainBody.width }
  get y1(): number { return this._mainBody.y }
  get y2(): number { return this._mainBody.y + this._mainBody.height }
  get width(): number { return this._mainBody.width }
  get height(): number { return this._mainBody.height }

  die(): void {
    super.beforeDie()

    this.setVisible(false)
    this._mainBody.setVelocityX(0)
    this._mainBody.setEnable(false)
    const explosion = this.scene.add.sprite(this.x, this.y, "explode", 0)
    explosion.setDepth(1)
    explosion.anims.play("explode")
    explosion.once("animationcomplete", () => {
      explosion.destroy()
      this.remove()
    })
  }
}