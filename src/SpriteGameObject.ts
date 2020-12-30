import GameObject from "./GameObject"

export default class SpriteGameObject extends GameObject {
  private _mainSprite: Phaser.GameObjects.Sprite
  private halfWidth: number
  private halfHeight: number

  protected get mainSprite(): Phaser.GameObjects.Sprite { return this._mainSprite }
  protected set mainSprite(s: Phaser.GameObjects.Sprite) { 
    this._mainSprite = s
    this.halfWidth = s.width / 2
    this.halfHeight = s.height / 2
  }

  get sprite(): Phaser.GameObjects.Sprite { return this._mainSprite }

  get x(): number { return this._mainSprite.x }
  get y(): number { return this._mainSprite.y }
  get x1(): number { return this._mainSprite.x - this.halfWidth }
  get x2(): number { return this._mainSprite.x + this.halfWidth }
  get y1(): number { return this._mainSprite.y - this.halfHeight }
  get y2(): number { return this._mainSprite.y + this.halfHeight }
  get width(): number { return this.mainSprite.width * this.mainSprite.scaleX }
  get height(): number { return this.mainSprite.height * this.mainSprite.scaleY }

  moveTo(x: number, y: number): void {
    this.mainSprite.setX(x)
    this.mainSprite.setY(Math.min(this.scene.groundPos - this.halfHeight, y))
  }

  setVisible(visible: boolean): void {
    this.mainSprite.setVisible(visible)
  }

  remove(): void {
    this._mainSprite.destroy()
    this.removed()
  }

  die(): void {
    super.beforeDie()

    this._mainSprite.setVisible(false)
    const body = this._mainSprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)
    body.setEnable(false)
    const explosion = this.scene.add.sprite(this._mainSprite.x,
                                            this._mainSprite.y, "explode", 0)
    explosion.setDepth(1)
    explosion.anims.play("explode")
    explosion.once("animationcomplete", () => {
      explosion.destroy()
      this.remove()
    })
  }
}