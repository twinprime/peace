import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class HealthBarGameObject extends GameObject {
  private _health: number
  private graphics: Phaser.GameObjects.Graphics

  constructor(scene: GameScene) {
    super(scene)
  }

  create(health: number): void {
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
    this.graphics.fillRect(10, 10, 100, 10)
    this.graphics.fillStyle(0xff0000)
    this.graphics.fillRect(10, 10, this._health, 10)
  }
}