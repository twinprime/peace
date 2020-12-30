import GameScene from "../GameScene"
import { BulletType } from "../mobile-objects/BulletGameObject"
import PhysicsBodyGameObject from "../PhysicsBodyGameObject"

export default class AAGunGameObject extends PhysicsBodyGameObject {
  private static chopperTrackDistanceSq = 500*500
  private static readonly bulletDamageMap = new Map<BulletType, number>([
    [BulletType.Chopper, 10], [BulletType.Tank, 20], [BulletType.Bunker, 10], [BulletType.Rifle, 1]])

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

    this.addBulletResponse(this.bodySprite, AAGunGameObject.bulletDamageMap)

    this.showHealthBar(16)
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

  setVisible(visible: boolean): void {
    this.gunSprite.setVisible(visible)
    this.bodySprite.setVisible(visible)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    super.update(time, delta)
    
    if (this.faceLeft && (time - this.lastFired > 500)) {
      const target = this.scene.gameMap.findChopper(this, AAGunGameObject.chopperTrackDistanceSq)
      if (target) {
        this.lastFired = time
        this.angle = Phaser.Math.Angle.BetweenPoints(target, this.gunSprite)
        const dir = new Phaser.Math.Vector2(
          target.x - this.gunSprite.x,
          target.y - this.gunSprite.y).normalize()
        this.scene.createBullet(this.owner, 30000, this.gunSprite.x + dir.x * 16, 
          this.gunSprite.y + dir.y * 16,
          dir.x * 200, dir.y * 200, BulletType.AA)
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