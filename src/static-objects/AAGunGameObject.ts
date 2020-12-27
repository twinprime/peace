import GameScene from "../GameScene"
import { BulletType } from "../mobile-objects/BulletGameObject"
import PhysicsBodyGameObject from "../PhysicsBodyGameObject"

export default class AAGunGameObject extends PhysicsBodyGameObject {
  private static chopperWaveDistanceSq = 500*500

  private _angle = 0
  private lastFired = 0
  private gunSprite: Phaser.GameObjects.Sprite
  private bodySprite: Phaser.GameObjects.Sprite
  private faceLeft: boolean
  private maxY: number

  constructor(scene: GameScene, owner: number, physicsGroup: Phaser.Physics.Arcade.Group, 
              x: number, angle: number) {
    super(scene, owner)

    this.faceLeft = owner < 0
    this.maxY = this.scene.groundPos - 16

    this.gunSprite = this.scene.add.sprite(x + (this.faceLeft ? 8 : -8), this.maxY, "aa-gun", 1)
    this.gunSprite.setDepth(10)
    this.angle = angle

    this.bodySprite = this.scene.physics.add.sprite(x, this.maxY, "aa-gun", 0)
    this.bodySprite.setDepth(10)
    if (!this.faceLeft) this.bodySprite.setFlipX(true)
    physicsGroup.add(this.bodySprite)
    const body = this.bodySprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    this.addWrapperProperty(this.bodySprite)

    this.mainBody = body
  }

  moveTo(x: number, y: number): void {
    this.gunSprite.setX(x + (this.faceLeft ? 8 : -8))
    this.gunSprite.setY(Math.min(y, this.maxY))
    this.bodySprite.setX(x)
    this.bodySprite.setY(Math.min(y, this.maxY))
  }

  remove(): void {
    this.gunSprite.destroy()
    this.bodySprite.destroy()
    this.removed()
  }

  update(time: number): void {
    if (this.faceLeft) {
      this.angle = Phaser.Math.Angle.BetweenPoints(this.scene.chopper.sprite, this.gunSprite)
      const distSq = Phaser.Math.Distance.BetweenPointsSquared(this.gunSprite, this.scene.chopper.sprite)
      if (distSq < AAGunGameObject.chopperWaveDistanceSq) {
        if ((time - this.lastFired) > 1000) {
          this.lastFired = time
          const dir = new Phaser.Math.Vector2(
            this.scene.chopper.sprite.x - this.gunSprite.x,
            this.scene.chopper.sprite.y - this.gunSprite.y).normalize()
          this.scene.createBullet(this.owner, 30000, this.gunSprite.x + dir.x * 16, 
            this.gunSprite.y + dir.y * 16,
            dir.x * 100, dir.y * 100, BulletType.AA)
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