import GameScene from "../GameScene";

export default class HealthBarGraphics {
  readonly graphics: Phaser.GameObjects.Graphics

  constructor(private readonly scene: GameScene,
              readonly width: number, readonly height: number) {
    this.graphics = this.scene.add.graphics()
  }

  draw(x: number, y: number, health: number): void {
    this.graphics.clear()
    this.graphics.fillStyle(0xf5e042)
    this.graphics.fillRect(x, y, this.width, this.height)
    this.graphics.fillStyle(0xff0000)
    this.graphics.fillRect(x, y, health / 100 * this.width, this.height)
  }
}