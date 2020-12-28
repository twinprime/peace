import GameObject from "../GameObject"
import GameScene from "../GameScene"
import HealthBarGraphics from "./HealthBarGraphics"

export default class HealthBarGameObject extends GameObject {
  readonly x1: number
  readonly x2: number
  readonly y1: number
  readonly y2: number

  private readonly graphics: HealthBarGraphics
  
  get width(): number { return this.graphics.width }
  get height(): number { return this.graphics.height }
  
  constructor(scene: GameScene, private readonly x: number, private readonly y: number) {
    super(scene, 0)
    
    this.x = x
    this.y = y
    this.graphics = new HealthBarGraphics(scene, 100, 10)
    this.graphics.graphics.setScrollFactor(0, 0)
    this.graphics.draw(x, y, this._health)

    this.x1 = this.x
    this.x2 = this.x + this.width
    this.y1 = this.y
    this.y2 = this.y + this.height
  }

  set health(h: number) {
    this._health = h
    this.graphics.draw(this.x, this.y, h)
  }

  remove(): void { throw "HealthBarGameObject cannot be removed" }
}