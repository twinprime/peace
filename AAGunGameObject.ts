import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class AAGunGameObject extends GameObject {
  private _angle = 0
  private lastFired = 0
  private gunSprite: Phaser.GameObjects.Sprite
  private faceLeft: boolean

  constructor(scene: GameScene) {
    super(scene)
  }

  create(x: number, angle: number, faceLeft: boolean): void {
    this.faceLeft = faceLeft
    this.gunSprite = this.scene.add.sprite(x + (faceLeft ? 8 : -8), this.scene.groundPos - 16, "aa-gun", 1)
    const sprite = this.scene.add.sprite(x, this.scene.groundPos - 16, "aa-gun", 0)
    if (!faceLeft) sprite.setFlipX(true)
    this.angle = angle
  }

  update(time: number): void {
    if (this.faceLeft) {
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
  }

  get angle(): number { return this._angle }
  set angle(newAngle: number) {
    if (this._angle != newAngle) {
      this.gunSprite.rotation = newAngle
      this._angle = newAngle
    }
  }

  static preload(scene: GameScene): void {
    scene.load.spritesheet("aa-gun", "/images/aa-gun.png", { frameWidth: 32, frameHeight: 32 })
  }
}