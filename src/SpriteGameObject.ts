import GameObject from "./GameObject"

export default class SpriteGameObject extends GameObject {
  private _x1: number
  private _x2: number
  private _y1: number
  private _y2: number
  private _mainSprite: Phaser.GameObjects.Sprite

  protected get mainSprite(): Phaser.GameObjects.Sprite { return this._mainSprite }
  protected set mainSprite(s: Phaser.GameObjects.Sprite) { 
    this._mainSprite = s
    this._x1 = s.x - s.width / 2
    this._x2 = s.x + s.width / 2
    this._y1 = s.y - s.height / 2
    this._y2 = s.y + s.height / 2
  }

  get x1(): number { return this._x1 }
  get x2(): number { return this._x2 }
  get y1(): number { return this._y1 }
  get y2(): number { return this._y2 }
  get width(): number { return this.mainSprite.width }
  get height(): number { return this.mainSprite.height }
}