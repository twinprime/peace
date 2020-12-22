import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class HealthBarGameObject extends GameObject {
  private _health: number
  private x: number
  private y: number
  private graphics: Phaser.GameObjects.Graphics
  
  private _width = 100
  get width(): number { return this._health }
  private _height = 10
  get height(): number { return this._height }
  
  constructor(scene: GameScene, x: number, y: number, health: number) {
    super(scene)
    
    this.x = x
    this.y = y
    this._health = health
    this.graphics = this.scene.add.graphics()
    this.graphics.setScrollFactor(0, 0)
    this.draw()
  }

  set health(h: number) {
    if (h != this._health) {
      this._health = h
      this.draw()
    }
  }

  private draw() {
    this.graphics.clear()
    this.graphics.fillStyle(0xf5e042)
    this.graphics.fillRect(this.x, this.y, this._width, this._height)
    this.graphics.fillStyle(0xff0000)
    this.graphics.fillRect(this.x, this.y, this._health, this._height)
  }
}