import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class AAGunGameObject extends GameObject {
  private _angle = 0
  private lastFired = 0
  private gunSprite: Phaser.GameObjects.Sprite

  constructor(scene: GameScene) {
    super(scene)
  }

  create(x: number, angle: number): void {
    this.gunSprite = this.scene.add.sprite(x + 8, this.scene.groundPos - 16, "aa-gun", 1)
    this.scene.add.sprite(x, this.scene.groundPos - 16, "aa-gun", 0)
    this.angle = angle
  }

  update(time: number): void {
    this.angle = Phaser.Math.Angle.BetweenPoints(this.scene.chopper.sprite, this.gunSprite)
    const dist = Phaser.Math.Distance.BetweenPointsSquared(this.gunSprite, this.scene.chopper.sprite)
    if (dist < 500*500) {
      if ((time - this.lastFired) > 1000) {
        this.lastFired = time
        const dir = new Phaser.Math.Vector2(
          this.scene.chopper.sprite.x - this.gunSprite.x,
          this.scene.chopper.sprite.y - this.gunSprite.y).normalize()
        this.scene.createBullet(this.gunSprite.x + dir.x * 16, 
          this.gunSprite.y + dir.y * 16,
           dir.x * 100, dir.y * 100)
      }
    }
  }

  get angle(): number { return this._angle }
  set angle(newAngle: number) {
    if (this._angle != newAngle) {
      this.gunSprite.rotation = newAngle
      this._angle = newAngle
    }
  }
}