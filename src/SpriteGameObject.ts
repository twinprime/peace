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

  get x1(): number { return this._mainSprite.x - this.halfWidth }
  get x2(): number { return this._mainSprite.x + this.halfWidth }
  get y1(): number { return this._mainSprite.y - this.halfHeight }
  get y2(): number { return this._mainSprite.y + this.halfHeight }
  get width(): number { return this.mainSprite.width }
  get height(): number { return this.mainSprite.height }

  remove(): void {
    this._mainSprite.destroy()
    this.removed()
  }
}