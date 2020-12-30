import GameObject from "../GameObject"
import GameScene from "../GameScene"
import HealthBarGraphics from "./HealthBarGraphics"

export default class HealthBarGameObject extends GameObject {
  readonly x: number
  readonly x2: number
  readonly y: number
  readonly y2: number

  private readonly graphics: HealthBarGraphics
  
  get width(): number { return this.graphics.width }
  get height(): number { return this.graphics.height }
  
  constructor(scene: GameScene, readonly x1: number, readonly y1: number) {
    super(scene, 0)
    
    this.graphics = new HealthBarGraphics(scene, 100, 10)
    this.graphics.graphics.setScrollFactor(0, 0)
    this.graphics.draw(x1, y1, this._health)

    this.x2 = this.x1 + this.width
    this.x = this.x1 + this.width / 2
    this.y2 = this.y1 + this.height
    this.y = this.y1 + this.height / 2
  }

  set health(h: number) {
    this._health = h
    this.graphics.draw(this.x1, this.y1, h)
  }

  setVisible(visible: boolean): void {
    this.graphics.graphics.setVisible(visible)
  }

  remove(): void { throw "HealthBarGameObject cannot be removed" }
}