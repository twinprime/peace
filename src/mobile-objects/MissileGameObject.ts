import GameObject from "../GameObject"
import GameScene from "../GameScene"
import SpriteGameObject from "../SpriteGameObject"

export class MissileGameObject extends SpriteGameObject {
  private static trackInterval = 50

  private readonly speed: number

  private startTime = 0
  private lastTrack = 0

  constructor(scene: GameScene, owner: number, 
              readonly physicsGroup: Phaser.Physics.Arcade.Group,
              readonly duration: number,
              x: number, y: number, 
              velocityX: number, velocityY: number,
              private readonly maxAcceleration: number,
              private readonly target: GameObject) {
    super(scene, owner)
    this.mainSprite = this.scene.add.sprite(x, y, "missile")
    this.mainSprite.setDepth(200)
    this.addWrapperProperty(this.mainSprite)
    this.physicsGroup.add(this.mainSprite)
    const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setVelocity(velocityX, velocityY)
    this.speed = body.velocity.length()
    body.useDamping = true
    body.setDrag(0.9, 0.9)
    this.updateRotation()
  }

  private updateRotation() {
    const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
    const angle = body.acceleration.lengthSq() > 0.01 ? 
      Phaser.Math.Angle.BetweenPoints(Phaser.Math.Vector2.ZERO, body.acceleration) :
      (body.velocity.lengthSq() > 0.01 ? 
        Phaser.Math.Angle.BetweenPoints(Phaser.Math.Vector2.ZERO, body.velocity) : 
          this.mainSprite.rotation)
    this.mainSprite.rotation = angle
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    super.update(time, delta)

    if (!this.dying) {
      if (this.startTime == 0) this.startTime = time
      else if ((time - this.startTime) > this.duration) this.die()
      else if ((time - this.lastTrack) > MissileGameObject.trackInterval) {
        this.lastTrack = time
        const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
        const reqVelocity = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y)
          .normalize().scale(this.speed)
        let acc = reqVelocity.subtract(body.velocity)
        if (acc.lengthSq() > this.maxAcceleration * this.maxAcceleration) {
          acc = acc.normalize().scale(this.maxAcceleration)
        }
        body.setAcceleration(acc.x, acc.y)
      }
      this.updateRotation()
    }
  }

  static preload(scene: GameScene): void {
    scene.load.image("missile", "/images/missile.png")
  }
}